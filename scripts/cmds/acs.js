/**
 * @fileoverview Goat Bot Custom Command - ACS Cyber Overlay
 * @author ACS RAKIB / Rakib Islam
 * Description: Overlays a cyber community frame onto a user-provided image.
 * Supports custom zoom parameters via reply commands.
 */

const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// আপনার দেওয়া প্রফেশনাল PNG ফ্রেমের ডিরেক্ট লিংক
const FRAME_URL = "https://i.ibb.co.com/bSkQBJn/20260517-213520.png";

module.exports = {
    config: {
        name: "acs",
        aliases: ["acs-mahi", "acs-rakib", "cyber", "overlay"],
        version: "2.1.0",
        author: "ACS RAKIB",
        countDown: 5,
        role: 0, // ০ = সবাই ব্যবহার করতে পারবে
        description: "গ্রুপ চ্যাটের ছবির ওপর সাইবার ফ্রেম এবং লোগো বসানোর কমান্ড",
        category: "image",
        guide: "{p}{n} [ছবিতে রিপ্লাই করুন]\\nঅপশন:\\n{p}{n} zoom20%\\n{p}{n} 30%\\n{p}{n} off"
    },

    onStart: async function ({ message, args }) {
        try {
            // ১. চেক করা হচ্ছে মেসেজটি কোনো ইমেজের রিপ্লাই কিনা
            if (message.type !== "message_reply" || !message.messageReply.attachments || message.messageReply.attachments.length === 0) {
                return message.reply("ভুল হয়েছে! দয়া করে একটি ছবির রিপ্লাইয়ে গিয়ে কমান্ডটি লিখুন।");
            }

            const attachment = message.messageReply.attachments[0];
            if (attachment.type !== "photo") {
                return message.reply("এটি শুধু ইমেজ বা ছবির ওপর কাজ করবে!");
            }

            const userImageUrl = attachment.url;
            await message.reply("Processing... আপনার ছবি তৈরি হচ্ছে, একটু অপেক্ষা করুন।");

            // ২. জুম প্যারামিটার হ্যান্ডেল করা (Default: ১৫% অটো জুম)
            let zoomPercent = 15; 
            let disableZoom = false;

            if (args.length > 0) {
                const argInput = args[0].toLowerCase();
                if (argInput.includes("off") || argInput.includes("zoomoff")) {
                    disableZoom = true;
                } else {
                    // ইউজার 'zoom20%' বা শুধু '20%' লিখলে সংখ্যাটি বের করা
                    const match = argInput.match(/\d+/);
                    if (match) {
                        zoomPercent = parseInt(match[0], 10);
                        if (zoomPercent < 0) zoomPercent = 0;
                        if (zoomPercent > 80) zoomPercent = 80; // ক্রপ সেফটি ক্যাপ
                    }
                }
            }

            // ৩. ইউজারের ছবি এবং পিএনজি ফ্রেম লোড করা
            const [mainImage, frameImage] = await Promise.all([
                loadImage(userImageUrl),
                loadImage(FRAME_URL)
            ]);

            // ৪. ক্যানভাস সাইজ নির্ধারণ (১:১ রেশিও ফ্রেমের সাথে মিল রেখে)
            const canvasSize = 1000; 
            const canvas = createCanvas(canvasSize, canvasSize);
            const ctx = canvas.getContext('2d');

            // ৫. জুম অন/অফ লজিক অনুযায়ী ছবি ড্র করা
            if (disableZoom) {
                // কোনো জুম হবে না, সম্পূর্ণ ছবি ফ্রেমে বসবে
                ctx.drawImage(mainImage, 0, 0, canvasSize, canvasSize);
            } else {
                // ইউজার ডেটা অনুযায়ী ছবির মাঝখানের অংশ ক্রপ করে জুম করা
                const factor = zoomPercent / 100;
                
                const cropWidth = mainImage.width * (1 - factor);
                const cropHeight = mainImage.height * (1 - factor);
                const cropX = (mainImage.width - cropWidth) / 2;
                const cropY = (mainImage.height - cropHeight) / 2;

                ctx.drawImage(
                    mainImage,
                    cropX, cropY, cropWidth, cropHeight, 
                    0, 0, canvasSize, canvasSize        
                );
            }

            // ৬. জুম করা ছবির ঠিক উপরে আপনার লোগো ও বর্ডারসহ PNG ফ্রেমটি বসানো
            ctx.drawImage(frameImage, 0, 0, canvasSize, canvasSize);

            // ৭. ফাইনাল ইমেজ ক্যাশে সেভ করে মেসেঞ্জারে পাঠানো
            const imageBuffer = canvas.toBuffer('image/png');
            const tempFilePath = path.join(__dirname, `cache_acs_${Date.now()}.png`);
            
            fs.writeFileSync(tempFilePath, imageBuffer);

            await message.reply({
                body: `✅ সফলভাবে তৈরি হয়েছে!\\n🔍 জুম স্ট্যাটাস: ${disableZoom ? 'বন্ধ (Off)' : zoomPercent + '%'}`,
                attachment: fs.createReadStream(tempFilePath)
            });

            // ক্যাশ ফাইলটি ডিলিট করে দেওয়া
            fs.unlinkSync(tempFilePath);

        } catch (error) {
            console.error("ACS Command Error:", error);
            return message.reply("ছবিটি প্রসেস করার সময় একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
        }
    }
};
      
