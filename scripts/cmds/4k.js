const axios = require('axios');
const fs = require('fs-extra'); 
const path = require('path');

const CACHE_DIR = path.join(__dirname, 'cache');

function extractImageUrl(args, event) {
    let imageUrl = args.find(arg => arg.startsWith('http'));

    if (!imageUrl && event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        const imageAttachment = event.messageReply.attachments.find(att => att.type === 'photo' || att.type === 'image');
        if (imageAttachment && imageAttachment.url) {
            imageUrl = imageAttachment.url;
        }
    }
    return imageUrl;
}

module.exports = {
  config: {
    name: "4k",
    aliases: ["hd", "upscale"],
    version: "5.0",
    author: "Rakibul Hasan",
    countDown: 10,
    role: 0,
    shortDescription: "Multi-API Auto Fallback 4K Upscaler",
    category: "image",
    guide: { en: "{pn} (reply to an image)" }
  },

  onStart: async function ({ args, message, event }) {
    const imageUrl = extractImageUrl(args, event);

    if (!imageUrl) {
      return message.reply("❌ Please reply to an image to upscale.");
    }

    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    message.reaction("⏳", event.messageID);
    let tempFilePath; 
    let response;

    // 🚀 ৩টি ভিন্ন ভিন্ন ফ্রি এপিআই দিয়ে ট্রাই করার মেকানিজম
    try {
        // প্রথম ট্রাই: এপিআই ১ (ফাস্ট অ্যান্ড ক্লিয়ার)
        const api1 = `https://smfahim.xyz/api/tools/upscale?url=${encodeURIComponent(imageUrl)}`;
        response = await axios.get(api1, { responseType: 'arraybuffer', timeout: 25000 });
    } catch (err) {
        try {
            console.log("API 1 failed, trying API 2...");
            // দ্বিতীয় ট্রাই: এপিআই ২ (অ্যানিমে ও ফটোর জন্য জোস)
            const api2 = `https://api.sandipbaruwal.codes/upscale?url=${encodeURIComponent(imageUrl)}`;
            response = await axios.get(api2, { responseType: 'arraybuffer', timeout: 25000 });
        } catch (err2) {
            try {
                console.log("API 2 failed, trying API 3...");
                // তৃতীয় ট্রাই: এapi ৩ (ব্যাকআপ রুট)
                const api3 = `https://shuddho-api.onrender.com/api/upscale?url=${encodeURIComponent(imageUrl)}`;
                response = await axios.get(api3, { responseType: 'arraybuffer', timeout: 25000 });
            } catch (err3) {
                response = null;
            }
        }
    }

    // যদি সব এপিআই-ই ফেইল করে
    if (!response || !response.data) {
        message.reaction("❌", event.messageID);
        return message.reply("❌ All premium scaling servers are currently busy. Please try again after a minute!");
    }

    try {
      const fileHash = Date.now();
      tempFilePath = path.join(CACHE_DIR, `4k_${fileHash}.jpg`);
      
      await fs.writeFile(tempFilePath, Buffer.from(response.data));
      message.reaction("✅", event.messageID);
      
      await message.reply({
        body: `🖼️ Image upscaled to 4K Quality!`,
        attachment: fs.createReadStream(tempFilePath)
      });
    } catch (error) {
      message.reaction("❌", event.messageID);
      message.reply("❌ Error sending upscaled attachment.");
    } finally {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
      }
    }
  }
};
      
