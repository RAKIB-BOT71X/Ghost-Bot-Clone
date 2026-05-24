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
    aliases: ["upscale", "hd", "enhance"],
    version: "2.0",
    author: "Rakibul Hasan", // আপনার ডেভেলপার সিগনেচার
    countDown: 15,
    role: 0,
    longDescription: "Upscales an image to higher resolution (4K) using ACS RAKIB'S API Hub.",
    category: "image",
    guide: {
      en: "{pn} <image_url> OR reply to an image.\n\n• Example: {pn} (reply to a photo)"
    }
  },

  onStart: async function ({ args, message, event }) {
    // ১. ইউজার লিঙ্ক দিয়েছে নাকি ছবিতে রিপ্লাই করেছে তা চেক করা
    const imageUrl = extractImageUrl(args, event);

    if (!imageUrl) {
      return message.reply("❌ Please provide an image URL or reply to an image to upscale.");
    }

    // cache ফোল্ডার না থাকলে তৈরি করা
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    // লোডিং রিয়্যাকশন (⏳) দেওয়া
    message.reaction("⏳", event.messageID);
    let tempFilePath; 

    try {
      // 🚀 আপনার নিজস্ব প্রিমিয়াম সাইবারপাংক এপিআই হাবের ইউআরএল
      const apiHubUrl = `https://cyberpunk-api-hub--explainrhk.replit.app/api/4k?url=${encodeURIComponent(imageUrl)}`;
      
      // ২. সরাসরি আপনার এপিআই হাব থেকে ইমেজ বাফার স্ট্রিম ডাউনলোড করা
      const response = await axios.get(apiHubUrl, {
          responseType: 'arraybuffer', // ইমেজ বাফার ক্যাচ করার জন্য
          timeout: 60000
      });

      // ৩. বাফার ফাইলটি টেম্পোরারি সেভ করা
      const fileHash = Date.now() + Math.random().toString(36).substring(2, 8);
      tempFilePath = path.join(CACHE_DIR, `upscale_4k_${fileHash}.jpg`);
      
      await fs.writeFile(tempFilePath, Buffer.from(response.data));

      // ✅ সফল হলে রিয়্যাকশন দেওয়া
      message.reaction("✅", event.messageID);
      
      // ৪. চ্যাটে ৪কে এইচডি ছবি দিয়ে রিপ্লাই করা
      await message.reply({
        body: `🖼️ Image successfully upscaled to 4K by ACS Hub!`,
        attachment: fs.createReadStream(tempFilePath)
      });

    } catch (error) {
      // ❌ এরর হলে ক্রস রিয়্যাকশন দেওয়া
      message.reaction("❌", event.messageID);
      console.error("4K Upscale Error:", error);
      message.reply("❌ Failed to upscale image. Your API server might be sleeping or rate-limited.");

    } finally {
      // ৫. কাজ শেষে ক্যাশ ফাইল ডিলিট করা (যাতে বটের স্টোরেজ ফুল না হয়)
      if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
      }
    }
  }
};
