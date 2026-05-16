const axios = require("axios");
const GIFS = [
  "https://media.tenor.com/7h5XK2ZBMHQAAAAC/anime-cute.gif",
  "https://media.tenor.com/OhRuF8eMDmkAAAAC/love-anime.gif",
  "https://media.tenor.com/BrYkfyF2LKUAAAAC/anime-love.gif",
  "https://media.tenor.com/k0_apKlkNx0AAAAC/couple-anime.gif",
];
module.exports = {
  config: {
    name: "kiss2",
    aliases: ["k2", "deepkiss", "muah"],
    version: "2.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Kiss2 — animated anime kiss GIF 😘",
    category: "fun", guide: { en: "{pn} @mention" }
  },
  onStart: async function ({ message, event, usersData }) {
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions || {})[0] || event.messageReply?.senderID;
    if (!uid2) return message.reply("💋 কাকে kiss করবে? মেনশন দাও বা reply করো!");
    const name1 = (await usersData.get(uid1))?.name || "তুমি";
    const name2 = (await usersData.get(uid2))?.name || "সে";
    const lines = [
      `💋 ${name1} ne ${name2} ko kiss kiya! 😘`,
      `😘 ${name2} tumi blush koro na, ${name1} tomar care kore! 💕`,
      `💋 MUAH! ${name1} → ${name2} 🌸`,
    ];
    const body = lines[Math.floor(Math.random()*lines.length)] +
      `\n\n💋 ════ Kiss2 Command ════ 💋\n  By Rakib Islam | Ghost Net 👻`;
    const gif = GIFS[Math.floor(Math.random()*GIFS.length)];
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 10000 });
      const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
      return message.reply({ body, attachment: st });
    } catch { return message.reply(body); }
  }
};
