const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "owner4",
    aliases: ["ownercard2", "creatorinfo", "rakibislam"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Owner card — Anime GIF style 🌸",
    category: "owner", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const body =
      `🌸 ╭──────────────────────╮ 🌸\n` +
      `   │  𝗥𝗔𝗞𝗜𝗕 𝗜𝗦𝗟𝗔𝗠 │\n` +
      `🌸 ╰──────────────────────╯ 🌸\n\n` +
      `🌟 Full Name  : ${GHOST.ownerName}\n` +
      `📌 Address    : ${GHOST.location}\n` +
      `💼 Job        : ${GHOST.job}\n` +
      `🎓 Class      : ${GHOST.class}\n` +
      `🎂 Age        : ${GHOST.age}\n` +
      `🎮 Interests  : ${GHOST.hobby}\n` +
      `💔 Love Status: ${GHOST.status}\n` +
      `☪️  Religion   : ${GHOST.religion}\n` +
      `🌐 Profile    : ${GHOST.facebook}\n\n` +
      `🤖 ─── Bot Info ───\n` +
      `🌸 ${GHOST.botName} | Ghost Net Edition\n` +
      `🔑 Prefix: ${GHOST.prefix}\n\n` +
      `🌸 ╰──────────────────────╯ 🌸\n` +
      `  Anime lover | Gamer | Creator 🎌`;
    const gif = "https://media.tenor.com/N3BJfA-C1oQAAAAC/anime-girl.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
