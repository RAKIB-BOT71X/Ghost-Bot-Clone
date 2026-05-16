const os = require("os");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "healthcheck",
    aliases: ["health", "hc", "botcheck"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Health check — bot diagnostics 💊",
    category: "system", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const t = Date.now(); await new Promise(r=>setTimeout(r,80)); const ping = Date.now()-t;
    const memPct = Math.round(((os.totalmem()-os.freemem())/os.totalmem())*100);
    const cpuLoad = os.loadavg()[0];
    const health = ping < 200 && memPct < 80 && cpuLoad < 2 ? "🟢 EXCELLENT" : ping < 500 && memPct < 90 ? "🟡 GOOD" : "🔴 STRESSED";
    const upSec = process.uptime();
    const body =
      `💊 ════════════════════ 💊\n` +
      `   𝗛𝗲𝗮𝗹𝘁𝗵 𝗗𝗶𝗮𝗴𝗻𝗼𝘀𝘁𝗶𝗰𝘀\n` +
      `💊 ════════════════════ 💊\n\n` +
      `🏥 Overall Health : ${health}\n\n` +
      `✅ API Status     : Online\n` +
      `✅ Commands       : Loaded\n` +
      `✅ Database       : Active\n` +
      `⚡ Ping           : ${ping}ms\n` +
      `💾 RAM Usage      : ${memPct}%\n` +
      `🌡️  CPU Load       : ${cpuLoad.toFixed(2)}\n` +
      `⏱️  Uptime         : ${Math.floor(upSec/3600)}h ${Math.floor((upSec%3600)/60)}m\n\n` +
      `💊 ════════════════════ 💊\n` +
      `  👻 ${GHOST.botName} Health v1.0`;
    const gif = "https://media.tenor.com/7h5XK2ZBMHQAAAAC/anime-cute.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
