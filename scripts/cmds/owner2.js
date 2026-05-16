const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "owner2",
    aliases: ["botowner2", "admininfo", "bosscard"],
    version: "2.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Owner card — Cyberpunk animated GIF 🔥",
    category: "owner", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const body =
      `🔥 ╔═══════════════════════╗ 🔥\n` +
      `   ║  𝗕𝗢𝗦𝗦 𝗜𝗡𝗙𝗢 𝗖𝗔𝗥𝗗  ║\n` +
      `🔥 ╚═══════════════════════╝ 🔥\n\n` +
      `👑 Name      : ${GHOST.ownerName}\n` +
      `📍 Base      : ${GHOST.location}\n` +
      `🎓 Class     : ${GHOST.class}\n` +
      `🎂 Age       : ${GHOST.age}\n` +
      `💼 Profession: ${GHOST.job}\n` +
      `🎮 Hobby     : ${GHOST.hobby}\n` +
      `💔 Status    : ${GHOST.status}\n` +
      `☪️  Faith     : ${GHOST.religion}\n` +
      `🔗 Facebook  : ${GHOST.facebook}\n\n` +
      `⚡ Bot Name  : ${GHOST.botName}\n` +
      `🌐 Edition   : ${GHOST.botEdition}\n\n` +
      `🔥 ═══════════════════════ 🔥\n` +
      `  💀 Ghost Net — Owner Confirmed`;
    const gif = "https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
