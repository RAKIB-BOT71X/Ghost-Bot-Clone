const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "profilebadge",
    aliases: ["pbadge", "rankprofile", "rprofile", "statscard"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 8,
    role: 0,
    shortDescription: "🏆 Rank Profile Card — stats + level + avatar",
    longDescription: "User এর rank card / stats card তৈরি করো — level, XP, rank সহ। @mention বা reply করো।",
    category: "image",
    guide: [
      "{pn} — নিজের rank card",
      "{pn} @mention — অন্যের card",
      "{pn} @mention - [level] - [rank]",
      "Example: .pbadge @Rakib - 25 - 3",
    ].join("\n"),
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;

    const mentionIDs = Object.keys(mentions || {});
    const targetID = mentionIDs[0] || messageReply?.senderID || senderID;

    api.setMessageReaction("🏆", messageID, () => {}, true);

    let targetName = "Ghost User";
    try { targetName = await usersData.getName(targetID) || "Ghost User"; } catch {}

    const input = args.join(" ");
    const parts = input.split("-").map(s => s.trim());
    const level = parseInt(parts[1]) || Math.floor(Math.random() * 50) + 1;
    const rank = parseInt(parts[2]) || Math.floor(Math.random() * 100) + 1;
    const maxXP = 5000;
    const currentXP = Math.floor(Math.random() * maxXP);

    const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

    const rankUrl = `https://api.joshwick.com/gen/rankcard?username=${encodeURIComponent(targetName)}&currentXP=${currentXP}&maxXP=${maxXP}&level=${level}&rank=${rank}&avatar=${encodeURIComponent(avatarUrl)}`;

    const fallbackUrl = `https://api.popcat.xyz/welcomecard?background=1a1a2e&text1=${encodeURIComponent(targetName)}&text2=Rank+%23${rank}+%7C+Level+${level}&text3=XP%3A+${currentXP}%2F${maxXP}&avatar=${encodeURIComponent(avatarUrl)}`;

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);
    const outPath = path.join(cacheDir, `rankcard_${Date.now()}.png`);

    let imgBuffer;
    try {
      const res = await axios.get(rankUrl, { responseType: "arraybuffer", timeout: 15000 });
      imgBuffer = Buffer.from(res.data);
    } catch {
      try {
        const res2 = await axios.get(fallbackUrl, { responseType: "arraybuffer", timeout: 12000 });
        imgBuffer = Buffer.from(res2.data);
      } catch (e) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return message.reply(`❌ Rank card তৈরি করা যায়নি।\nError: ${e.message}`);
      }
    }

    await fs.writeFile(outPath, imgBuffer);

    await api.sendMessage(
      {
        body: `🏆 𝗥𝗮𝗻𝗸 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗖𝗮𝗿𝗱\n━━━━━━━━━━━━━━━━━━\n👤 Name: ${targetName}\n⭐ Level: ${level}\n🏅 Rank: #${rank}\n📊 XP: ${currentXP} / ${maxXP}\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`,
        attachment: fs.createReadStream(outPath),
      },
      threadID,
      () => { try { fs.unlinkSync(outPath); } catch {} },
      messageID
    );
    api.setMessageReaction("✅", messageID, () => {}, true);
  }
};
