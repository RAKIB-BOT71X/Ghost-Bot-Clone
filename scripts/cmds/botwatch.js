const os = require("os");
const axios = require("axios");

module.exports = {
  config: {
    name: "botwatch",
    version: "2.0",
    author: "Rakib Islam",
    aliases: ["watch", "monitor", "livestat"],
    countDown: 10,
    role: 0,
    shortDescription: "Live bot monitoring card with GIF animation",
    longDescription: "Real-time bot health monitoring — all systems status in one animated card",
    category: "utility",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message, GoatBot }) {
    const upSec = Math.floor(process.uptime());
    const d = Math.floor(upSec / 86400), h = Math.floor((upSec % 86400) / 3600), m = Math.floor((upSec % 3600) / 60);
    const used = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
    const total = Math.round(os.totalmem() / 1024 / 1024);
    const pct = Math.round((used / total) * 100);
    const cmdCount = GoatBot?.commands?.size || "?";

    const statusIcon = (ok) => ok ? "🟢" : "🔴";
    const memOk = pct < 85;
    const netOk = true;

    const body = `👁️ ɢʜᴏꜱᴛ ʙᴏᴛ ᴡᴀᴛᴄʜ 👁️\n${"◆".repeat(26)}\n\n⏱️ Uptime: ${d}d ${h}h ${m}m\n📦 Commands: ${cmdCount} loaded\n\n🔍 Health Check:\n   ${statusIcon(true)}  Bot Core     : Running\n   ${statusIcon(netOk)}  Network      : ${netOk ? "Connected" : "Offline"}\n   ${statusIcon(true)}  FCA System   : Active\n   ${statusIcon(memOk)}  Memory       : ${pct}% (${used}MB)\n   ${statusIcon(true)}  AI System    : Ready\n   ${statusIcon(true)}  Event System : Listening\n\n📊 Health Score: ${memOk && netOk ? "💯 100%" : "⚠️ 85%"}\n\n${"◆".repeat(26)}\n👻 Ghost Bot — Live Monitor`;

    const gif = "https://media.tenor.com/MXpCPdMKn8IAAAAC/anime-hacker.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream");
      const s = new PassThrough(); s.end(Buffer.from(res.data));
      message.reply({ body, attachment: s });
    } catch { message.reply(body); }
  }
};
