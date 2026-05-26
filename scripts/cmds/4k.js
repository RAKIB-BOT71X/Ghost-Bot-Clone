const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const CACHE_DIR = path.join(__dirname, 'cache');
const API_HUB_BASE = "https://cyberpunk-api-hub--explainrhk.replit.app/api/4k";

/**
 * মেসেজের আর্গুমেন্ট অথবা রিপ্লাই থেকে ছবির ইউআরএল এক্সট্রাক্ট করার প্রফেশনাল ফাংশন
 */
function getValidImageUrl(args, event) {
    if (args && args.length > 0) {
        const urlArg = args.find(arg => arg.startsWith('http://') || arg.startsWith('https://'));
        if (urlArg) return urlArg;
    }
    
    if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        const attachment = event.messageReply.attachments.find(att => att.type === 'photo' || att.type === 'image');
        if (attachment && attachment.url) return attachment.url;
    }
    
    if (event.attachments && event.attachments.length > 0) {
        const attachment = event.attachments.find(att => att.type === 'photo' || att.type === 'image');
        if (attachment && attachment.url) return attachment.url;
    }
    
    return null;
}

module.exports = {
    config: {
        name: "4k",
        aliases: ["hd", "upscale", "enhance", "remini"],
        version: "12.0.0", // মেগা প্রো-ভার্সন
        author: "Rakibul Hasan",
        countDown: 8,
        role: 0,
        shortDescription: "Ultra AI 4K Image Upscaler via Cyberpunk API Hub",
        longDescription: "Advanced image enhancement system communicating with professional 5-layer fallback API clusters.",
        category: "image",
        guide: {
            en: "{pn} [reply to an image] or {pn} <image_url>\n\nNote: Generates high-fidelity 4K output utilizing server-side AI processing."
        }
    },

    onStart: async function ({ args, message, event }) {
        const targetUrl = getValidImageUrl(args, event);

        if (!targetUrl) {
            return message.reply("⚠️ [ERROR] No image source detected. Please reply to a valid image or provide a direct image link.");
        }

        // ডিরেক্টরি সিকিউরিটি চেক
        try {
            await fs.ensureDir(CACHE_DIR);
        } catch (dirErr) {
            console.error("[4K System Error] Cache directory allocation failed:", dirErr.message);
            return message.reply("❌ [Local FileSystem Error] Failed to initialize secure caching structure.");
        }

        // ইউজারকে প্রসেসিং স্টেট জানানো
        const infoMessage = await message.reply("⚡ [Cyberpunk Hub] Directing image payload to AI Cluster. Processing may take up to 30-40 seconds. Please wait...");
        await message.reaction("⏳", event.messageID);

        const timestamp = Date.now();
        const secureFileName = `cyberpunk_4k_cluster_${timestamp}_${Math.floor(Math.random() * 10000)}.png`;
        const localPath = path.join(CACHE_DIR, secureFileName);

        try {
            const targetApiEndpoint = `${API_HUB_BASE}?url=${encodeURIComponent(targetUrl)}`;
            console.log(`[Cyberpunk API Call] Dispatched request to endpoint: ${targetApiEndpoint}`);

            // হাই-টাইমআউট ক্লাউড রিকোয়েস্ট স্ট্রিমিং
            const apiResponse = await axios({
                method: 'get',
                url: targetApiEndpoint,
                responseType: 'arraybuffer',
                timeout: 120000, // ২ মিনিট বাফার টাইমআউট (সেফটি ফার্স্ট)
                headers: {
                    'Accept': 'image/jpeg, image/png, application/octet-stream',
                    'User-Agent': 'Mozilla/5.0 (Ghost Net Core OS; Rakibul Hasan Edition)'
                }
            });

            // ডাটা ভ্যালিডেশন চেক (সার্ভার টেক্সট এরর বা ব্ল্যাংক রেসপন্স পাঠিয়েছে কি না)
            if (!apiResponse.data || apiResponse.data.length < 500) {
                throw new Error("Received corrupted or empty data buffer from API backend.");
            }

            // বাফার রাইটিং লক
            await fs.writeFile(localPath, Buffer.from(apiResponse.data));

            // সফল স্টেট আপডেট
            await message.reaction("✅", event.messageID);
            if (infoMessage && infoMessage.messageID) {
                await message.unsend(infoMessage.messageID).catch(() => {});
            }

            // ছবি ও মেটাডাটা ডেলিভারি
            return await message.reply({
                body: `🌐 [SUCCESS] Cyberpunk Hub AI Enhancement Complete!\n\n✨ Developer: Rakibul Hasan\n🎨 Quality: Ultra HD / 4K Array\n⚙️ Status: Verified 200 OK`,
                attachment: fs.createReadStream(localPath)
            });

        } catch (error) {
            // এরর ম্যানেজমেন্ট এবং ফলব্যাক লগিং
            console.error(`🚨 [Critical 4K Command Failure]:`, error.message);
            await message.reaction("❌", event.messageID);
            
            if (infoMessage && infoMessage.messageID) {
                await message.unsend(infoMessage.messageID).catch(() => {});
            }

            let clientErrorMessage = "❌ [AI Cluster Error] Failed to upscale image. All 5 fallback layers on the API Hub failed or returned a timeout.";
            
            if (error.code === 'ECONNABORTED') {
                clientErrorMessage = "⏱️ [Timeout Error] The AI processing cluster took too long to respond. The server might be booting up or overloaded.";
            } else if (error.response) {
                const responseStatusCode = error.response.status;
                clientErrorMessage = `❗ [API Backend Error] Server responded with code ${responseStatusCode}. Check your Replit Agent backend configuration.`;
            }

            return message.reply(clientErrorMessage);

        } finally {
            // মেমোরি লিক এবং হার্ডডিস্ক স্পেস জ্যাম হওয়া বন্ধ করার স্ট্রিশ্ট মেথড
            setTimeout(async () => {
                try {
                    const fileExists = await fs.pathExists(localPath);
                    if (fileExists) {
                        await fs.unlink(localPath);
                        console.log(`[Cache Garbage Collector] Safely deleted temp file: ${secureFileName}`);
                    }
                } catch (cleanupErr) {
                    console.error(`[GC Warning] Failed to delete cache file: ${secureFileName}`, cleanupErr.message);
                }
            }, 5000); // ৫ সেকেন্ড সেফটি বাফার ফর ওএস স্ট্রিম লক
        }
    }
};
