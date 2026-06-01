const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const config = {
    name: "autodl",
    version: "2.0",
    author: "mahi",
    credits: "mahi",
    description: "Auto download video from tiktok, facebook, Instagram, YouTube, and more",
    category: "media",
    commandCategory: "media",
    usePrefix: true,
    prefix: true,
    dependencies: {
        "fs-extra": "",
    },
};

const onStart = () => {};

const onChat = async ({ api, event }) => {
    let mahi = event.body ? event.body : "";
    
    try {
        if (
            mahi.startsWith("https://vt.tiktok.com") ||
            mahi.startsWith("https://www.tiktok.com/") ||
            mahi.startsWith("https://www.facebook.com") ||
            mahi.startsWith("https://www.instagram.com/") ||
            mahi.startsWith("https://youtu.be/") ||
            mahi.startsWith("https://youtube.com/") ||
            mahi.startsWith("https://x.com/") ||
            mahi.startsWith("https://www.instagram.com/p/") ||
            mahi.startsWith("https://pin.it/") ||
            mahi.startsWith("https://twitter.com/") ||
            mahi.startsWith("https://vm.tiktok.com") ||
            mahi.startsWith("https://fb.watch") ||
            mahi.startsWith("https://www.threads.net/")
        ) {
            api.setMessageReaction("⌛", event.messageID, {}, true);
            
            const apiUrl = `https://tenzo.is-a.dev/api/download/alldl?url=${encodeURIComponent(mahi)}`;
            
            const response = await axios.get(apiUrl, { timeout: 15000 });
            
            let mediaUrl = null;
            let caption = "";
            let platform = "";
            
            if (response.data && response.data.success && response.data.videos && response.data.videos.length > 0) {
                mediaUrl = response.data.videos[0].url;
                platform = response.data.platform || "unknown";
                caption = response.data.caption || response.data.title || "";
            } else {
                throw new Error("No media found");
            }
            
            if (!mediaUrl) {
                throw new Error("Failed to get media URL");
            }
            
            let ex = ".mp4";
            
            if (mediaUrl.includes(".jpg") || mediaUrl.endsWith(".jpg")) {
                ex = ".jpg";
            } else if (mediaUrl.includes(".png") || mediaUrl.endsWith(".png")) {
                ex = ".png";
            } else if (mediaUrl.includes(".jpeg") || mediaUrl.endsWith(".jpeg")) {
                ex = ".jpeg";
            }
            
            const cacheDir = path.join(__dirname, 'cache');
            await fs.ensureDir(cacheDir);
            
            const filePath = path.join(cacheDir, `media_${Date.now()}${ex}`);
            const mediaResponse = await axios.get(mediaUrl, { 
                responseType: "arraybuffer", 
                timeout: 60000 
            });
            await fs.writeFile(filePath, Buffer.from(mediaResponse.data));
            
            let tinyUrl = mediaUrl;
            try {
                const tinyUrlResponse = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(mediaUrl)}`, { timeout: 5000 });
                if (tinyUrlResponse.data && !tinyUrlResponse.data.includes("Error")) {
                    tinyUrl = tinyUrlResponse.data;
                }
            } catch (tinyErr) {}
            
            api.setMessageReaction("✅", event.messageID, {}, true);
            
            await api.sendMessage({
                body: `° Here is your demanded video\n° tiny : ${tinyUrl}\n`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, (err) => {
                if (err) console.error("Send error:", err);
                fs.unlink(filePath).catch(e => console.error("Error deleting file:", e));
            }, event.messageID);
        }
    } catch (err) {
        api.setMessageReaction("❌", event.messageID, {}, true);
        console.error("Main error:", err);
        
        const errorMsg = err.message || "Unknown error";
        await api.sendMessage(`❌ Error: ${errorMsg}\n\nPlease try with a different link.`, event.threadID, event.messageID);
    }
};

module.exports = {
    config,
    onChat,
    onStart,
    run: onStart,
    handleEvent: onChat,
};
