const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "owner5",
    aliases: ["bossprofile", "admincard", "ghostboss"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Owner card — Neon lightning GIF ⚡",
    category: "owner", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const body =
      `⚡ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ⚡\n` +
      `  ⚡ 𝗕𝗢𝗦𝗦 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 ⚡\n` +
      `⚡ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ⚡\n\n` +
      `👤 Boss Name : ${GHOST.ownerName}\n` +
      `🏙️  City      : ${GHOST.location}\n` +
      `🎓 Level      : ${GHOST.class}\n` +
      `⚡ Power      : ${GHOST.age} (classified)\n` +
      `🎯 Mission    : ${GHOST.job}\n` +
      `🎮 Hobbies    : ${GHOST.hobby}\n` +
      `💔 Heart Stat : ${GHOST.status}\n` +
      `🔗 Find Me    : ${GHOST.facebook}\n\n` +
      `🤖 My Bot     : ${GHOST.botName}\n` +
      `👻 Codename   : Ghost Net Admin\n\n` +
      `⚡ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ⚡\n` +
      `  💀 Level: LEGENDARY`;
    const gif = "https://media.tenor.com/svLMd5r2KRYAAAAC/neon-light.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
