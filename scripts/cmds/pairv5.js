const axios = require("axios");
const HEARTS = ["💕","💖","💗","💓","💘","❤️‍🔥","🥰","😍","💝","💞"];
const GIFS = [
  "https://media.tenor.com/k0_apKlkNx0AAAAC/couple-anime.gif",
  "https://media.tenor.com/BrYkfyF2LKUAAAAC/anime-love.gif",
  "https://media.tenor.com/OhRuF8eMDmkAAAAC/love-anime.gif",
];
module.exports = {
  config: {
    name: "pairv5",
    aliases: ["lovecard5", "lc5", "lovev5"],
    version: "2.0", author: "Rakib Islam",
    countDown: 10, role: 0,
    shortDescription: "Love Card v5 — Unique animated GIF 💘",
    category: "romantic", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event, usersData, threadsData }) {
    await message.reaction("💕", event.messageID);
    try {
      const threadInfo = await threadsData.get(event.threadID);
      const members = threadInfo?.members || [];
      const others = members.filter(m => m.userID !== event.senderID);
      if (!others.length) return message.reply("💔 No pair members!");
      const partner = others[Math.floor(Math.random() * others.length)];
      const myData = await usersData.get(event.senderID);
      const partnerData = await usersData.get(partner.userID);
      const myName = myData?.name || "You";
      const partnerName = partnerData?.name || "Partner";
      const score = Math.floor(Math.random() * 26) + 75;
      const h = HEARTS[5 % HEARTS.length];
      const body =
        h + " ══════════════════ " + h + "\n" +
        "   𝗟𝗢𝗩𝗘 𝗖𝗔𝗥𝗗 v5 — Ghost Net\n" +
        h + " ══════════════════ " + h + "\n\n" +
        "💑 " + myName + " 💞 " + partnerName + "\n\n" +
        "💯 Love Match : " + score + "%\n" +
        "❤️  Bond Level : " + "💗".repeat(Math.floor(score/20)) + "\n\n" +
        "💌 Tomar jnyo amar dil beat kore!\n" +
        "   — Ghost Net Love Card\n\n" +
        h + " ══════════════════ " + h + "\n" +
        "  By Rakib Islam | Ghost Net";
      const gif = GIFS[5 % GIFS.length];
      try {
        const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 10000 });
        const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
        return message.reply({ body, attachment: st });
      } catch { return message.reply(body); }
    } catch (e) { return message.reply("❌ " + e.message); }
  }
};
