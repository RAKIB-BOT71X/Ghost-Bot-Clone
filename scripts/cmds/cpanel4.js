const os = require("os");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "cpanel4",
    aliases: ["cp4", "botcore", "coreinfo"],
    version: "1.0", author: "Rakib Islam",
    countDown: 10, role: 2,
    shortDescription: "Control Panel v4 — Core diagnostics 🔩",
    category: "admin", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const t = Date.now(); await new Promise(r=>setTimeout(r,80)); const lat = Date.now()-t;
    const mem = process.memoryUsage();
    const grade = lat<100?"S+ 🌟":lat<250?"A 🏆":lat<500?"B ✅":"C ⚠️";
    const body =
      `🔩 ════════════════════════ 🔩\n` +
      `   𝗖𝗼𝗿𝗲 𝗗𝗶𝗮𝗴𝗻𝗼𝘀𝘁𝗶𝗰𝘀 𝗣𝗮𝗻𝗲𝗹\n` +
      `🔩 ════════════════════════ 🔩\n\n` +
      `⚡ Command Latency : ${lat}ms\n` +
      `🏅 Performance Grade: ${grade}\n\n` +
      `💾 Heap Used    : ${(mem.heapUsed/1e6).toFixed(2)}MB\n` +
      `📦 Heap Total   : ${(mem.heapTotal/1e6).toFixed(2)}MB\n` +
      `🧠 External Mem : ${(mem.external/1e6).toFixed(2)}MB\n` +
      `🌡️  CPU Load     : ${os.loadavg().map(l=>l.toFixed(2)).join(" | ")}\n` +
      `⏱️  Process Up   : ${Math.floor(process.uptime()/60)}min\n\n` +
      `🔩 ════════════════════════ 🔩\n` +
      `  👻 ${GHOST.botName} — Core Panel v4`;
    const gif = "https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
