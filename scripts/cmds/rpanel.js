const os = require("os");
const axios = require("axios");

module.exports = {
  config: {
    name: "rpanel",
    version: "3.0",
    author: "Rakib Islam",
    aliases: ["remotepanel", "rempanel"],
    countDown: 10,
    role: 2,
    shortDescription: "Remote Control Panel with animated GIF",
    longDescription: "Remote system monitoring panel — network, process, system info with animated card",
    category: "admin",
    guide: { en: "{pn} — Ghost Remote Panel" }
  },

  onStart: async function ({ message }) {
    const nets = os.networkInterfaces();
    const netNames = Object.keys(nets).slice(0, 3).join(", ") || "localhost";

    const cpus = os.cpus();
    const cpuModel = cpus[0]?.model?.substring(0, 30) || "Unknown CPU";
    const cpuCount = cpus.length;

    const body = `📡 ɢʜᴏꜱᴛ ʀᴇᴍᴏᴛᴇ ᴘᴀɴᴇʟ 📡\n${"▬".repeat(28)}\n\n🖥️ System Info:\n   OS    : ${os.type()} ${os.arch()}\n   Host  : ${os.hostname()}\n   Kernel: ${os.release()}\n\n⚙️ CPU Info:\n   Model : ${cpuModel}\n   Cores : ${cpuCount} cores\n   Speed : ${cpus[0]?.speed || 0}MHz\n\n🌐 Network:\n   IFs   : ${netNames}\n\n💻 Process:\n   PID   : ${process.pid}\n   Node  : ${process.version}\n   Uptime: ${Math.floor(process.uptime())}s\n\n${"▬".repeat(28)}\n👻 Remote Panel — Ghost Net v3.0`;

    const gif = "https://media.tenor.com/M4UYdtYjnNsAAAAC/neon-glitch.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream");
      const s = new PassThrough(); s.end(Buffer.from(res.data));
      message.reply({ body, attachment: s });
    } catch { message.reply(body); }
  }
};
