const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const EDIT_APIS = [
  (prompt, imgUrl) => `https://dev.oculux.xyz/api/fluxkontext?prompt=${encodeURIComponent(prompt)}&ref=${encodeURIComponent(imgUrl)}`,
  (prompt, imgUrl) => `https://noobs-api.top/dipto/editimage?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(imgUrl)}`,
  (prompt, imgUrl) => `https://api.kshitiz.com.np/ai/flux-kontext?prompt=${encodeURIComponent(prompt)}&image=${encodeURIComponent(imgUrl)}`,
];

module.exports = {
  config: {
    name: "edit",
    aliases: ["editimg", "aidit", "imageedit"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 30,
    role: 0,
    shortDescription: "AI image editor — reply to image + prompt 🎨",
    longDescription: "Edit any image using AI (FluxKontext). Reply to a photo with your edit prompt.",
    category: "ai-image-edit",
    guide: { en: "{pn} [prompt] (reply to image)\nExample: {pn} Make it look like anime" }
  },

  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(" ").trim();
    const repliedImage = event.messageReply?.attachments?.find(a => a.type === "photo" || a.type === "sticker");
    const directImage = event.attachments?.find(a => a.type === "photo");
    const imgAttachment = repliedImage || directImage;

    if (!imgAttachment) {
      return message.reply(
        `🎨 𝗔𝗜 𝗜𝗺𝗮𝗴𝗲 𝗘𝗱𝗶𝘁𝗼𝗿\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `❌ কোনো image reply করোনি!\n\n` +
        `✅ সঠিক ব্যবহার:\n` +
        `1. কোনো image এ reply করো\n` +
        `2. লেখো: .edit [prompt]\n\n` +
        `📝 Example:\n` +
        `.edit make it anime style\n` +
        `.edit add sunset background\n` +
        `.edit cartoon version\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `👻 Ghost Net | Rakib Islam`
      );
    }

    if (!prompt) {
      return message.reply(
        `🎨 Prompt দাও!\nExample: .edit make it anime style\n👻 Ghost Net | Rakib Islam`
      );
    }

    const processingMsg = await message.reply(
      `⏳ AI দিয়ে image edit হচ্ছে...\n🎨 Prompt: "${prompt}"\n⏰ একটু অপেক্ষা করুন!`
    );

    const imgURL = imgAttachment.url || imgAttachment.playableUrl || imgAttachment.previewUrl;
    if (!imgURL) {
      try { await api.unsendMessage(processingMsg.messageID); } catch {}
      return message.reply("❌ Image URL পাওয়া যায়নি! অন্য image try করুন।");
    }

    const imgPath = path.join(__dirname, "cache", `edit_${Date.now()}.jpg`);
    await fs.ensureDir(path.dirname(imgPath));

    for (let i = 0; i < EDIT_APIS.length; i++) {
      try {
        const apiURL = EDIT_APIS[i](prompt, imgURL);
        const res = await axios.get(apiURL, {
          responseType: "arraybuffer",
          timeout: 60000,
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        if (!res.data || res.data.byteLength < 1000) continue;

        await fs.writeFile(imgPath, Buffer.from(res.data));
        try { await api.unsendMessage(processingMsg.messageID); } catch {}

        await message.reply({
          body: `✅ 𝗔𝗜 𝗘𝗱𝗶𝘁 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲!\n🎨 Prompt: "${prompt}"\n\n👻 Ghost Net | Rakib Islam`,
          attachment: fs.createReadStream(imgPath)
        });

        try { await fs.remove(imgPath); } catch {}
        return;
      } catch {}
    }

    try { await api.unsendMessage(processingMsg.messageID); } catch {}
    try { await fs.remove(imgPath); } catch {}
    return message.reply(
      `❌ Image edit failed!\n\n` +
      `🔧 সব API কাজ করছে না।\n` +
      `⏰ একটু পরে আবার try করুন।\n` +
      `👻 Ghost Net | Rakib Islam`
    );
  }
};
