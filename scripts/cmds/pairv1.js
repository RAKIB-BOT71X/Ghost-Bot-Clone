const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const LOVE_GIFS = [
  "https://media.tenor.com/5e7b5fa46dea3f0a5e9b23e6b76e6c0a/tenor.gif",
  "https://media.tenor.com/OhRuF8eMDmkAAAAC/love-anime.gif",
  "https://media.tenor.com/k0_apKlkNx0AAAAC/couple-anime.gif",
  "https://media.tenor.com/BrYkfyF2LKUAAAAC/anime-love.gif",
];
const HEARTS = ["💕","💖","💗","💓","💘","❤️‍🔥","🥰","😍","💝","💞"];

module.exports = {
  config: {
    name: "pairv1",
    aliases: ["lovepair", "lovecard1", "lc1"],
    version: "3.0", author: "Rakib Islam",
    countDown: 10, role: 0,
    shortDescription: "Love Card v1 — Romantic pair with animated GIF 💕",
    category: "romantic", guide: { en: "{pn} — Random love pair" }
  },
  onStart: async function ({ message, event, usersData, threadsData }) {
    await message.reaction("💕", event.messageID);
    try {
      const threadInfo = await threadsData.get(event.threadID);
      const members = threadInfo?.members || [];
      const others = members.filter(m => m.userID !== event.senderID);
      if (others.length === 0) return message.reply("💔 এই গ্রুপে তোমার জোড়া লাগানোর মতো কেউ নেই!");
      const partner = others[Math.floor(Math.random() * others.length)];
      const myData = await usersData.get(event.senderID);
      const partnerData = await usersData.get(partner.userID);
      const myName = myData?.name || "তুমি";
      const partnerName = partnerData?.name || "সে";
      const score = Math.floor(Math.random() * 31) + 70;
      const h = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      const bars = "💗".repeat(Math.floor(score/10)) + "🤍".repeat(10-Math.floor(score/10));
      const body =
        `${h} ═══════════════════ ${h}\n` +
        `   𝗟𝗢𝗩𝗘 𝗖𝗔𝗥𝗗 ✨ v1\n` +
        `${h} ═══════════════════ ${h}\n\n` +
        `💑 Couple:\n` +
        `   🌹 ${myName}\n` +
        `   💞    ❤️ loves ❤️\n` +
        `   🌹 ${partnerName}\n\n` +
        `💯 Love Score : ${score}%\n` +
        `${bars}\n\n` +
        `💬 "${myName} tomar jonno ❤️ beat kore!"\n` +
        `   — ${partnerName} ke mone rekho 🌸\n\n` +
        `${h} ═══════════════════ ${h}\n` +
        `  Made with ❤️ by Rakib Islam`;
      const gif = LOVE_GIFS[Math.floor(Math.random() * LOVE_GIFS.length)];
      try {
        const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 10000 });
        const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
        return message.reply({ body, attachment: st });
      } catch { return message.reply(body); }
    } catch (e) { return message.reply("❌ Error: " + e.message); }
  }
};
