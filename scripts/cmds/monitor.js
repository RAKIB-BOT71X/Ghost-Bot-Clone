const os = require("os");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "monitor",
    aliases: ["mon", "livemon", "realtime"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Live system monitor with cyber GIF 📡",
    category: "system", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const t1 = Date.now(); await new Promise(r=>setTimeout(r,100)); const latency = Date.now()-t1;
    const mem = process.memoryUsage();
    const freeMem = os.freemem(), totalMem = os.totalmem();
    const pct = Math.round(((totalMem-freeMem)/totalMem)*100);
    const bar = p => "▓".repeat(Math.floor(p/10)) + "░".repeat(10-Math.floor(p/10));
    const body =
      `📡 ════════════════════ 📡\n` +
      `   𝗟𝗶𝘃𝗲 𝗕𝗼𝘁 𝗠𝗼𝗻𝗶𝘁𝗼𝗿\n` +
      `📡 ════════════════════ 📡\n\n` +
      `🟢 Status      : ONLINE\n` +
      `⚡ Latency     : ${latency}ms\n` +
      `💾 RAM Usage   : [${bar(pct)}] ${pct}%\n` +
      `🧠 Heap        : ${(mem.heapUsed/1e6).toFixed(1)}/${(mem.heapTotal/1e6).toFixed(1)}MB\n` +
      `🌡️  Load Avg    : ${os.loadavg()[0].toFixed(2)}\n` +
      `🔢 CPU Cores   : ${os.cpus().length}\n` +
      `⏱️  Process Up  : ${Math.floor(process.uptime()/60)}min\n\n` +
      `📡 ════════════════════ 📡\n` +
      `  👻 ${GHOST.botName} | Real-time Monitor`;
    const gif = "https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
