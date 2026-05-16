const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

const GIFS = [
  "https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif",
  "https://media.tenor.com/svLMd5r2KRYAAAAC/neon-light.gif",
  "https://media.tenor.com/QWCII8p7iqQAAAAC/galaxy-space.gif",
  "https://media.tenor.com/XjMPL3X2YNIAAAAC/anime-bot.gif",
];

module.exports = {
  config: {
    name: "ghostinfo",
    aliases: ["ghost", "gi", "ghostbotinfo", "botinfo2"],
    version: "2.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Ghost Bot সম্পূর্ণ info — GIF animated 👻",
    category: "info", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600), m = Math.floor((uptime % 3600) / 60), s = Math.floor(uptime % 60);
    const totalCmds = require("fs").readdirSync(path.join(__dirname)).filter(f => f.endsWith(".js")).length;
    const mem = process.memoryUsage();
    const body =
      `👻 ━━━━━━━━━━━━━━━━━━━━━━ 👻\n` +
      `   𝗚𝗛𝗢𝗦𝗧 𝗡𝗘𝗧 — 𝗕𝗼𝘁 𝗜𝗻𝗳𝗼\n` +
      `👻 ━━━━━━━━━━━━━━━━━━━━━━ 👻\n\n` +
      `🤖 Bot Name  : ${GHOST.botName}\n` +
      `🌐 Edition   : ${GHOST.botEdition}\n` +
      `🔑 Prefix    : ${GHOST.prefix}\n` +
      `💻 Commands  : ${totalCmds}+\n\n` +
      `👤 Owner     : ${GHOST.ownerName}\n` +
      `📍 Location  : ${GHOST.location}\n` +
      `💼 Job       : ${GHOST.job}\n` +
      `🎮 Hobby     : ${GHOST.hobby}\n` +
      `💔 Status    : ${GHOST.status}\n` +
      `☪️  Religion  : ${GHOST.religion}\n` +
      `🔗 FB        : ${GHOST.facebook}\n\n` +
      `⏱️  Uptime    : ${h}h ${m}m ${s}s\n` +
      `💾 Memory    : ${(mem.heapUsed / 1e6).toFixed(1)}MB\n` +
      `🌐 Node.js   : ${process.version}\n` +
      `🕐 TimeZone  : ${GHOST.timeZone}\n\n` +
      `👻 ━━━━━━━━━━━━━━━━━━━━━━ 👻\n` +
      `  💀 Powered by Ghost Net Edition`;
    const gif = GIFS[Math.floor(Math.random() * GIFS.length)];
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 10000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID);
      return message.reply({ body, attachment: st });
    } catch {
      await message.reaction("✅", event.messageID);
      return message.reply(body);
    }
  }
};
