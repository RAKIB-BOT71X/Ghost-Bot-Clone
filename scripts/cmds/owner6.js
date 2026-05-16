const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const GIFS = [
  "https://media.tenor.com/7h5XK2ZBMHQAAAAC/anime-cute.gif",
  "https://media.tenor.com/XjMPL3X2YNIAAAAC/anime-bot.gif",
  "https://media.tenor.com/FBi2gu-MQUYAAAAC/aesthetic-anime.gif",
  "https://media.tenor.com/N3BJfA-C1oQAAAAC/anime-girl.gif",
  "https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif",
];
const FRAMES = [
  ["🎌","𝗢𝗪𝗡𝗘𝗥 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 #6"],
  ["💫","𝗕𝗢𝗧 𝗖𝗥𝗘𝗔𝗧𝗢𝗥 𝗖𝗔𝗥𝗗 #6"],
  ["👑","𝗥𝗔𝗞𝗜𝗕 𝗜𝗦𝗟𝗔𝗠 𝗖𝗔𝗥𝗗 #6"],
  ["🌟","𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗦𝗦 #6"],
  ["🔥","𝗖𝗥𝗘𝗔𝗧𝗢𝗥 𝗜𝗡𝗙𝗢 #6"],
];
const idx = 6 % FRAMES.length;
module.exports = {
  config: {
    name: "owner6",
    aliases: ["ownerinfo6", "oinfo6"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Owner profile card #6 with unique GIF",
    category: "owner", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event }) {
    await message.reaction("⏳", event.messageID);
    const [ico, title] = FRAMES[idx];
    const body =
      ico + " ━━━━━━━━━━━━━━━━━━━━━━ " + ico + "\n" +
      "   " + title + "\n" +
      ico + " ━━━━━━━━━━━━━━━━━━━━━━ " + ico + "\n\n" +
      "👤 Name      : " + GHOST.ownerName + "\n" +
      "📍 Location  : " + GHOST.location + "\n" +
      "💼 Job       : " + GHOST.job + "\n" +
      "🎓 Class     : " + GHOST.class + "\n" +
      "🎂 Age       : " + GHOST.age + "\n" +
      "🎮 Hobby     : " + GHOST.hobby + "\n" +
      "💔 Status    : " + GHOST.status + "\n" +
      "☪️  Religion  : " + GHOST.religion + "\n" +
      "🔗 FB        : " + GHOST.facebook + "\n\n" +
      "🤖 Bot       : " + GHOST.botName + "\n" +
      "🌐 Edition   : " + GHOST.botEdition + "\n\n" +
      ico + " ━━━━━━━━━━━━━━━━━━━━━━ " + ico + "\n" +
      "  Ghost Net — Variant #6";
    const gif = GIFS[6 % GIFS.length];
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      await message.reaction("✅", event.messageID); return message.reply({ body, attachment: st });
    } catch { await message.reaction("✅", event.messageID); return message.reply(body); }
  }
};
