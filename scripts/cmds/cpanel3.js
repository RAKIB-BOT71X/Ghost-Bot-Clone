const os = require("os");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "cpanel3",
    aliases: ["cp3", "botenv", "envinfo"],
    version: "1.0", author: "Rakib Islam",
    countDown: 10, role: 2,
    shortDescription: "Control Panel v3 — Environment info 🌐",
    category: "admin", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const body =
      `🌐 ════════════════════════ 🌐\n` +
      `   𝗘𝗻𝘃𝗶𝗿𝗼𝗻𝗺𝗲𝗻𝘁 𝗜𝗻𝗳𝗼 𝗣𝗮𝗻𝗲𝗹\n` +
      `🌐 ════════════════════════ 🌐\n\n` +
      `🔧 Node.js    : ${process.version}\n` +
      `🏗️  Arch       : ${process.arch}\n` +
      `🌐 Platform   : ${process.platform}\n` +
      `🔑 PID        : ${process.pid}\n` +
      `🌡️  OS Type    : ${os.type()}\n` +
      `📡 Hostname   : ${os.hostname()}\n` +
      `💾 RAM Total  : ${(os.totalmem()/1e9).toFixed(2)}GB\n` +
      `🆓 RAM Free   : ${(os.freemem()/1e9).toFixed(2)}GB\n` +
      `⚡ CPU Cores  : ${os.cpus().length}\n` +
      `🏠 Home Dir   : ${os.homedir().slice(0,25)}\n` +
      `📁 Temp Dir   : ${os.tmpdir().slice(0,25)}\n\n` +
      `🌐 ════════════════════════ 🌐\n` +
      `  👻 ${GHOST.botName} — Env Panel v3`;
    const gif = "https://media.tenor.com/QWCII8p7iqQAAAAC/galaxy-space.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
