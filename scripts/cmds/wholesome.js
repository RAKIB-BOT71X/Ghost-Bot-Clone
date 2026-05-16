const jimp = require("jimp");
const fs = require("fs");
const path = require("path");
const GHOST = require("fs-extra").readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "wholesome",
    aliases: ["wsome", "crush"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortdescription: "wholesome",
    longDescription: "Wholesome avatar image — mention বা reply করো",
    category: "fun",
    guide: "{pn} @mention অথবা reply করো"
  },
  onStart: async function ({ message, event, usersData }) {
    const { mentions, senderID, messageReply } = event;
    const mentionIDs = Object.keys(mentions || {});
    const targetID = mentionIDs[0] || messageReply?.senderID || null;

    if (!targetID) return message.reply(`❤️ @mention করো অথবা কারো message এ reply দিয়ে .wholesome লিখো!\n\n👻 Ghost Bot — ${GHOST.ownerName}`);

    let targetName = "Friend";
    try { targetName = await usersData.getName(targetID) || "Friend"; } catch {}

    try {
      const avatarone = await jimp.read(`https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
      const image = await jimp.read("https://i.imgur.com/BnWiVXT.jpg");
      image.resize(512, 512).composite(avatarone.resize(173, 173), 70, 186);
      const imagePath = path.join(__dirname, `wholesome_${targetID}.png`);
      await image.writeAsync(imagePath);

      await message.reply({
        body: `💕 ${targetName} তুমি অনেক wholesome! 🥰❤️\n👻 Ghost Bot — ${GHOST.ownerName}`,
        attachment: fs.createReadStream(imagePath),
        mentions: targetID && Object.values(mentions)[0] ? [{ tag: Object.values(mentions)[0], id: targetID }] : []
      });
      try { fs.unlinkSync(imagePath); } catch {}
    } catch (error) {
      await message.reply(`❌ Image তৈরি করতে পারিনি! আবার try করো।\n\n👻 Ghost Bot`);
    }
  }
};
