const os = require("os");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "performance",
    aliases: ["perf", "perfmon", "botperf2"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Detailed bot performance metrics 🎯",
    category: "system", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const t = Date.now(); await new Promise(r => setTimeout(r, 50));
    const responseTime = Date.now() - t;
    const mem = process.memoryUsage();
    const cpu = os.cpus()[0];
    const sec = process.uptime();
    const d = Math.floor(sec/86400), h = Math.floor((sec%86400)/3600), m = Math.floor((sec%3600)/60);
    const body =
      `🎯 ════════════════════ 🎯\n` +
      `   𝗣𝗲𝗿𝗳𝗼𝗿𝗺𝗮𝗻𝗰𝗲 𝗠𝗼𝗻𝗶𝘁𝗼𝗿\n` +
      `🎯 ════════════════════ 🎯\n\n` +
      `⚡ Response Time : ~${responseTime}ms\n` +
      `🏃 Uptime        : ${d}d ${h}h ${m}m\n` +
      `💾 Heap Used     : ${(mem.heapUsed/1e6).toFixed(1)}MB\n` +
      `📦 Heap Total    : ${(mem.heapTotal/1e6).toFixed(1)}MB\n` +
      `🧠 External      : ${(mem.external/1e6).toFixed(1)}MB\n` +
      `🔢 Array Buffers : ${(mem.arrayBuffers/1e6).toFixed(1)}MB\n` +
      `🖥️  CPU Model     : ${cpu.model.slice(0,30)}\n` +
      `⚡ CPU Speed     : ${cpu.speed}MHz\n` +
      `🌡️  Load Average  : ${os.loadavg().map(l=>l.toFixed(2)).join(", ")}\n\n` +
      `🎯 ════════════════════ 🎯\n` +
      `  👻 ${GHOST.botName} | Perf v1.0`;
    const gif = "https://media.tenor.com/svLMd5r2KRYAAAAC/neon-light.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID);
      return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
