const axios = require("axios");

module.exports = {
  config: {
    name: "ghostping",
    version: "2.0",
    author: "Rakib Islam",
    aliases: ["gping", "latency", "msping"],
    countDown: 5,
    role: 0,
    shortDescription: "Bot ping & latency check with GIF animation",
    longDescription: "Measures bot response latency and Facebook API ping with animated GIF display",
    category: "utility",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message }) {
    const t = Date.now();
    const sentMsg = await message.reply("🏓 Pinging...");
    const ms = Date.now() - t;

    const grade = ms < 100 ? "⚡ LIGHTNING" : ms < 300 ? "🚀 FAST" : ms < 600 ? "🟡 NORMAL" : "🔴 SLOW";
    const stars = ms < 100 ? "⭐⭐⭐⭐⭐" : ms < 300 ? "⭐⭐⭐⭐" : ms < 600 ? "⭐⭐⭐" : "⭐⭐";

    let extPing = 0;
    try {
      const t2 = Date.now();
      await axios.get("https://1.1.1.1", { timeout: 3000 });
      extPing = Date.now() - t2;
    } catch { extPing = -1; }

    const body = `🏓 ɢʜᴏꜱᴛ ᴘɪɴɢ 🏓\n${"═".repeat(24)}\n\n🤖 Bot Response : ${ms}ms\n🌐 Network Ping : ${extPing >= 0 ? extPing + "ms" : "Failed"}\n\n⚡ Speed Grade  : ${grade}\n⭐ Rating       : ${stars}\n\n📊 Status: ${ms < 500 ? "🟢 Excellent" : "🟡 Check Network"}\n\n${"═".repeat(24)}\n👻 Ghost Bot — Ping Monitor`;

    const gif = "https://media.tenor.com/XjMPL3X2YNIAAAAC/anime-bot.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream");
      const s = new PassThrough(); s.end(Buffer.from(res.data));
      message.reply({ body, attachment: s });
    } catch { message.reply(body); }
  }
};
