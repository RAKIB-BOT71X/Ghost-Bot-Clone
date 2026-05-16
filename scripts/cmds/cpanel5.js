const os = require("os");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "cpanel5",
    aliases: ["cp5", "fullreport", "botreport"],
    version: "1.0", author: "Rakib Islam",
    countDown: 10, role: 2,
    shortDescription: "Control Panel v5 — Full system report 📋",
    category: "admin", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event, usersData, threadsData }) {
    await message.reaction("⏳", event.messageID);
    const t = Date.now(); await new Promise(r=>setTimeout(r,60)); const lat = Date.now()-t;
    let users="?", threads="?";
    try { users=(await usersData.getAll()).length; } catch {}
    try { threads=(await threadsData.getAll()).length; } catch {}
    const totalCmds = fs.readdirSync(path.join(__dirname)).filter(f=>f.endsWith(".js")).length;
    const upSec = process.uptime();
    const mem = process.memoryUsage();
    const body =
      `📋 ════════════════════════ 📋\n` +
      `   𝗙𝘂𝗹𝗹 𝗦𝘆𝘀𝘁𝗲𝗺 𝗥𝗲𝗽𝗼𝗿𝘁\n` +
      `📋 ════════════════════════ 📋\n\n` +
      `👻 ${GHOST.botName} — ${GHOST.botEdition}\n` +
      `👑 Owner: ${GHOST.ownerName}\n\n` +
      `📊 Stats:\n` +
      `   💻 Commands : ${totalCmds}+\n` +
      `   👤 Users    : ${users}\n` +
      `   💬 Groups   : ${threads}\n\n` +
      `⚙️  System:\n` +
      `   ⚡ Latency : ${lat}ms\n` +
      `   ⏱️  Uptime  : ${Math.floor(upSec/3600)}h ${Math.floor((upSec%3600)/60)}m\n` +
      `   💾 Heap    : ${(mem.heapUsed/1e6).toFixed(1)}/${(mem.heapTotal/1e6).toFixed(1)}MB\n` +
      `   🖥️  CPU     : ${os.cpus().length}c | ${os.loadavg()[0].toFixed(2)}\n` +
      `   🌐 Node.js : ${process.version}\n\n` +
      `📋 ════════════════════════ 📋\n` +
      `  👑 Ghost Net Full Report v5`;
    const gif = "https://media.tenor.com/svLMd5r2KRYAAAAC/neon-light.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
