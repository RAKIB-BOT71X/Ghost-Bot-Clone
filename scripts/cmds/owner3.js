const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "owner3",
    aliases: ["ocard", "masterinfo", "topdog"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Owner card — Galaxy space GIF 🌌",
    category: "owner", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const body =
      `🌌 ━━━━━━━━━━━━━━━━━━━━━━━━ 🌌\n` +
      `   ✨ 𝗢𝗪𝗡𝗘𝗥 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 ✨\n` +
      `🌌 ━━━━━━━━━━━━━━━━━━━━━━━━ 🌌\n\n` +
      `⭐ আমার নাম     : ${GHOST.ownerName}\n` +
      `🏠 আমার ঠিকানা : ${GHOST.location}\n` +
      `📚 পেশা         : ${GHOST.job}\n` +
      `🎓 ক্লাস        : ${GHOST.class}\n` +
      `🎂 বয়স          : ${GHOST.age}\n` +
      `🎮 শখ           : ${GHOST.hobby}\n` +
      `💔 বর্তমান অবস্থা: ${GHOST.status}\n` +
      `🔗 FB Contact   : ${GHOST.facebook}\n\n` +
      `🤖 Bot          : ${GHOST.botName}\n` +
      `🌐 Edition      : ${GHOST.botEdition}\n\n` +
      `🌌 ━━━━━━━━━━━━━━━━━━━━━━━━ 🌌\n` +
      `  Made with ❤️ for Ghost Net`;
    const gif = "https://media.tenor.com/QWCII8p7iqQAAAAC/galaxy-space.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
