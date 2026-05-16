const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "pn",
    aliases: ["phstyle", "phlogo", "yellowlogo"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "🟡 Yellow-Orange Logo Style — দুটো word কে logo style এ দেখাও",
    longDescription: "Classic yellow-black logo style এ দুটো word কে একসাথে দেখাও। .pn Hinata bby লিখলে ওই style এ image আসবে।",
    category: "fun",
    guide: [
      "{pn} [word1] [word2]",
      "Example: .pn Hinata bby",
      "Example: .pn Ghost Bot",
      "Example: .pn Rakib Islam",
    ].join("\n"),
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;

    if (!args[0]) {
      return message.reply(
        `🟡 𝗬𝗲𝗹𝗹𝗼𝘄 𝗟𝗼𝗴𝗼 𝗦𝘁𝘆𝗹𝗲\n━━━━━━━━━━━━━━━━━━\n\nUsage: .pn [word1] [word2]\n\nExample:\n.pn Hinata bby\n.pn Ghost Bot\n.pn Rakib Islam\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`
      );
    }

    const midIndex = Math.ceil(args.length / 2);
    const text1 = args.slice(0, midIndex).join(" ");
    const text2 = args.slice(midIndex).join(" ") || text1.slice(Math.ceil(text1.length / 2));

    api.setMessageReaction("🟡", messageID, () => {}, true);

    const apis = [
      `https://api.popcat.xyz/pornhub?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`,
      `https://api.joshwick.com/gen/pornhub?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`,
    ];

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);
    const outPath = path.join(cacheDir, `pnlogo_${Date.now()}.png`);

    let imgBuffer = null;
    for (const url of apis) {
      try {
        const res = await axios.get(url, { responseType: "arraybuffer", timeout: 12000 });
        const buf = Buffer.from(res.data);
        if (buf.length > 1000) { imgBuffer = buf; break; }
      } catch {}
    }

    if (!imgBuffer) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply(`❌ Logo তৈরি করা যায়নি। কিছুক্ষণ পর আবার try করো!\n👻 Ghost Bot`);
    }

    await fs.writeFile(outPath, imgBuffer);

    await api.sendMessage(
      {
        body: `🟡 [ ${text1} ] [ ${text2} ]\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`,
        attachment: fs.createReadStream(outPath),
      },
      threadID,
      () => { try { fs.unlinkSync(outPath); } catch {} },
      messageID
    );
    api.setMessageReaction("✅", messageID, () => {}, true);
  }
};
