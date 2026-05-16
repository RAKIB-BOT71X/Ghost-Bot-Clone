const os = require("os");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "procinfo",
    aliases: ["process", "proc", "v8info"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Process & V8 engine info 🔧",
    category: "system", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const mem = process.memoryUsage();
    const v8 = require("v8").getHeapStatistics();
    const body =
      `🔧 ════════════════════ 🔧\n` +
      `   𝗣𝗿𝗼𝗰𝗲𝘀𝘀 & 𝗩8 𝗘𝗻𝗴𝗶𝗻𝗲\n` +
      `🔧 ════════════════════ 🔧\n\n` +
      `🔑 PID           : ${process.pid}\n` +
      `🔧 Node.js       : ${process.version}\n` +
      `🏗️  Arch          : ${process.arch}\n` +
      `🌐 Platform      : ${process.platform}\n` +
      `⏱️  Uptime        : ${Math.floor(process.uptime()/60)}min ${Math.floor(process.uptime()%60)}s\n\n` +
      `💾 Heap Used     : ${(mem.heapUsed/1e6).toFixed(2)}MB\n` +
      `📦 Heap Total    : ${(mem.heapTotal/1e6).toFixed(2)}MB\n` +
      `🧠 V8 Heap Limit : ${(v8.heap_size_limit/1e6).toFixed(2)}MB\n` +
      `📊 V8 Committed  : ${(v8.total_committed_chunk_size/1e6).toFixed(2)}MB\n` +
      `🔢 External Mem  : ${(mem.external/1e6).toFixed(2)}MB\n\n` +
      `🔧 ════════════════════ 🔧\n` +
      `  👻 ${GHOST.botName} | Process Monitor`;
    const gif = "https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
