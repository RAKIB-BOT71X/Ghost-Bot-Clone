const os = require("os");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "cpanel",
    aliases: ["controlpanel", "panel", "admin"],
    version: "4.0", author: "Rakib Islam",
    countDown: 10, role: 2,
    shortDescription: "Ghost Bot Control Panel v4 — Admin only 🖥️",
    category: "admin", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const upSec = Math.floor(process.uptime());
    const h = Math.floor(upSec/3600), m = Math.floor((upSec%3600)/60), s = upSec%60;
    const usedMem = Math.round((os.totalmem()-os.freemem())/1024/1024);
    const totalMem = Math.round(os.totalmem()/1024/1024);
    const memPct = Math.round((usedMem/totalMem)*100);
    const cpuLoad = os.loadavg()[0].toFixed(2);
    const cpuPct = Math.min(Math.round(parseFloat(cpuLoad)*10),100);
    const bar = n => "█".repeat(Math.floor(n/10)) + "░".repeat(10-Math.floor(n/10));
    const totalCmds = fs.readdirSync(path.join(__dirname)).filter(f=>f.endsWith(".js")).length;
    const body =
      `🖥️  ╔════════════════════════╗ 🖥️\n` +
      `   ║ 𝗘𝘄𝗿 𝗛𝗶𝗻𝗮𝘁𝗮 𝗖𝗣𝗮𝗻𝗲𝗹 ║\n` +
      `🖥️  ╚════════════════════════╝ 🖥️\n\n` +
      `⏱️  Uptime     : ${h}h ${m}m ${s}s\n` +
      `🔧 Node.js    : ${process.version}\n` +
      `🖥️  Platform   : ${os.type()}\n` +
      `💻 Commands   : ${totalCmds}+\n\n` +
      `💾 Memory:\n   [${bar(memPct)}] ${memPct}%\n   ${usedMem}MB / ${totalMem}MB\n\n` +
      `⚡ CPU Load:\n   [${bar(cpuPct)}] ${cpuPct}%\n   Avg: ${cpuLoad}\n\n` +
      `🌐 Owner      : ${GHOST.ownerName}\n` +
      `🤖 Bot        : ${GHOST.botName}\n\n` +
      `🖥️  ═══════════════════════ 🖥️\n` +
      `  👑 Ghost Net Control Panel v4.0`;
    const gif = "https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
