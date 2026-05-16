const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const HEARTS = ["💕","💖","💗","💓","💘","❤️‍🔥","🥰","😍","💝","💞"];

module.exports = {
  config: {
    name: "pairv2",
    aliases: ["lovecard2", "lc2", "soulpair"],
    version: "2.0", author: "Rakib Islam",
    countDown: 10, role: 0,
    shortDescription: "Love Card v2 — Soulmate finder 💞",
    category: "romantic", guide: { en: "{pn}" }
  },
  onStart: async function ({ message, event, usersData, threadsData }) {
    await message.reaction("💞", event.messageID);
    try {
      const threadInfo = await threadsData.get(event.threadID);
      const members = threadInfo?.members || [];
      const others = members.filter(m => m.userID !== event.senderID);
      if (!others.length) return message.reply("💔 No members to pair with!");
      const partner = others[Math.floor(Math.random() * others.length)];
      const myData = await usersData.get(event.senderID);
      const partnerData = await usersData.get(partner.userID);
      const myName = myData?.name || "তুমি";
      const partnerName = partnerData?.name || "সে";
      const score = Math.floor(Math.random() * 21) + 80;
      const h = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      const lines = [
        `"${partnerName} tumi amar heart steal korecho! 💕"`,
        `"${myName} ar ${partnerName} — perfect match! 🌹"`,
        `"Tomader love story legend hobe! ❤️‍🔥"`,
        `"${partnerName} tumi na thakle boro lonely lagto! 🥺"`,
      ];
      const body =
        `💞 ╭────────────────────╮ 💞\n` +
        `   │ 𝗦𝗢𝗨𝗟𝗠𝗔𝗧𝗘 𝗖𝗔𝗥𝗗 v2 │\n` +
        `💞 ╰────────────────────╯ 💞\n\n` +
        `🌹 ${myName}  ${h}  ${partnerName}\n\n` +
        `💯 Compatibility : ${score}%\n` +
        `❤️  Level         : ${"💗".repeat(Math.floor(score/20))}\n\n` +
        `💬 ${lines[Math.floor(Math.random()*lines.length)]}\n\n` +
        `💞 ╰────────────────────╯ 💞\n` +
        `  Ghost Net | Rakib Islam`;
      const gif = "https://media.tenor.com/OhRuF8eMDmkAAAAC/love-anime.gif";
      try {
        const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 10000 });
        const { PassThrough } = require("stream"); const st = new PassThrough(); st.end(Buffer.from(res.data));
        return message.reply({ body, attachment: st });
      } catch { return message.reply(body); }
    } catch (e) { return message.reply("❌ " + e.message); }
  }
};
