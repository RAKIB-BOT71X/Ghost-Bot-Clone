const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

const GIFS = [
  "https://media.tenor.com/N3BJfA-C1oQAAAAC/anime-girl.gif",
  "https://media.tenor.com/FBi2gu-MQUYAAAAC/aesthetic-anime.gif",
  "https://media.tenor.com/7h5XK2ZBMHQAAAAC/anime-cute.gif",
  "https://media.tenor.com/XjMPL3X2YNIAAAAC/anime-bot.gif",
];

const TEMPLATES = [
  { name: "Dark Ghost",    bg: "0d0d1a" },
  { name: "Purple Night",  bg: "1a0a2e" },
  { name: "Ghost Gradient",bg: "0f0f23" },
  { name: "Cyber Dark",    bg: "060618" },
  { name: "Neon Shadow",   bg: "050515" },
];

module.exports = {
  config: {
    name: "ghostcard",
    aliases: ["gc", "profilecard", "gcard"],
    version: "2.0", author: "Rakib Islam",
    countDown: 8, role: 0,
    shortDescription: "👻 Ghost Profile Card — dark theme + GIF 🎨",
    longDescription: "User এর profile card তৈরি করো — dark ghost theme + animated GIF সহ।",
    category: "image",
    guide: { en: "{pn} | {pn} @mention | {pn} @mention - [title] - [status]" }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;
    const mentionIDs = Object.keys(mentions || {});
    const targetID = mentionIDs[0] || messageReply?.senderID || senderID;

    await message.reaction("🎨", messageID);

    let targetName = "Ghost User";
    try { targetName = await usersData.getName(targetID) || "Ghost User"; } catch {}

    const input = args.join(" ");
    const parts = input.split("-").map(s => s.trim());
    const title = parts[1] || "Ghost Bot Member";
    const status = parts[2] || "Ghost Net Edition";

    const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    const cardUrl = `https://api.popcat.xyz/welcomecard?background=${template.bg}&text1=${encodeURIComponent(targetName)}&text2=${encodeURIComponent(title)}&text3=${encodeURIComponent(status)}&avatar=${encodeURIComponent(avatarUrl)}`;

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);
    const outPath = path.join(cacheDir, `ghostcard_${Date.now()}.png`);

    const body =
      `👻 𝗚𝗵𝗼𝘀𝘁 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗖𝗮𝗿𝗱\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 Name   : ${targetName}\n` +
      `🏷️  Title  : ${title}\n` +
      `📌 Status : ${status}\n` +
      `🎨 Theme  : ${template.name}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👻 Ghost Bot — ${GHOST.ownerName}`;

    // Try to get card image first
    let cardStream = null;
    try {
      const res = await axios.get(cardUrl, { responseType: "arraybuffer", timeout: 15000 });
      await fs.writeFile(outPath, Buffer.from(res.data));
      cardStream = fs.createReadStream(outPath);
    } catch {
      // Try fallback
      try {
        const fallUrl = `https://api.popcat.xyz/welcomecard?background=212121&text1=${encodeURIComponent(targetName)}&text2=${encodeURIComponent(title)}&text3=${encodeURIComponent(status)}&avatar=${encodeURIComponent(avatarUrl)}`;
        const res2 = await axios.get(fallUrl, { responseType: "arraybuffer", timeout: 12000 });
        await fs.writeFile(outPath, Buffer.from(res2.data));
        cardStream = fs.createReadStream(outPath);
      } catch {}
    }

    // Always add GIF animation
    const gif = GIFS[Math.floor(Math.random() * GIFS.length)];
    let gifStream = null;
    try {
      const gifRes = await axios.get(gif, { responseType: "arraybuffer", timeout: 10000 });
      const { PassThrough } = require("stream");
      gifStream = new PassThrough();
      gifStream.end(Buffer.from(gifRes.data));
    } catch {}

    await message.reaction("✅", messageID);

    if (cardStream && gifStream) {
      // Send card image first, then GIF
      await api.sendMessage({ body, attachment: cardStream }, threadID, messageID);
      await api.sendMessage({ body: "✨ Ghost Net — " + GHOST.ownerName, attachment: gifStream }, threadID);
      try { fs.unlinkSync(outPath); } catch {}
    } else if (cardStream) {
      await api.sendMessage({ body, attachment: cardStream }, threadID, () => { try { fs.unlinkSync(outPath); } catch {} }, messageID);
    } else if (gifStream) {
      await api.sendMessage({ body, attachment: gifStream }, threadID, messageID);
    } else {
      await api.sendMessage(body, threadID, messageID);
    }
  }
};
