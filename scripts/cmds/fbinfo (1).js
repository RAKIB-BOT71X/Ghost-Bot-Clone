const axios = require("axios");
const { PassThrough } = require("stream");

async function getFBInfo(uid) {
  try {
    const res = await axios.get(
      `https://graph.facebook.com/${uid}?fields=id,name,vanity_url,about,gender,locale,link,picture.width(720)&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { timeout: 10000 }
    );
    return res.data;
  } catch {
    return null;
  }
}

module.exports = {
  config: {
    name: "fbinfo",
    aliases: ["facebookinfo", "userinfo", "profileinfo", "fbdetails"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: "📘 Full Facebook Profile Info",
    longDescription: "Get full Facebook profile info for any user. Mention or reply or enter UID.",
    category: "info",
    guide: { en: "{pn} @mention — Mentioned user info\n{pn} reply — Replied user info\n{pn} <uid> — Info by UID\n{pn} — Your own info" }
  },

  onStart: async function ({ message, event, usersData, args }) {
    const { senderID, mentions, messageReply } = event;

    let targetID = senderID;
    const mentionKeys = Object.keys(mentions || {});

    if (mentionKeys.length > 0) {
      targetID = mentionKeys[0];
    } else if (messageReply?.senderID) {
      targetID = messageReply.senderID;
    } else if (args[0] && /^\d{10,}$/.test(args[0])) {
      targetID = args[0];
    }

    await message.react("⏳");

    try {
      const fbData = await getFBInfo(targetID);
      const userData = await usersData.get(targetID).catch(() => null);
      const botName = userData?.name || fbData?.name || "Unknown";
      const money = userData?.money ?? 0;
      const exp = userData?.exp ?? 0;

      const allData = await usersData.getAll().catch(() => []);
      const sorted = allData.sort((a, b) => (b.money || 0) - (a.money || 0));
      const rank = sorted.findIndex(u => u.userID == targetID) + 1;

      const gender = fbData?.gender === "male" ? "👦 Male" : fbData?.gender === "female" ? "👧 Female" : "❓ Unknown";
      const locale = fbData?.locale || "Unknown";
      const vanity = fbData?.vanity_url ? `facebook.com/${fbData.vanity_url}` : "N/A";
      const about = fbData?.about ? fbData.about.slice(0, 80) : "N/A";
      const profileLink = fbData?.link || `https://facebook.com/${targetID}`;
      const moneyFmt = money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      const line = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

      const info =
        `📘 ══ 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𝗜𝗡𝗙𝗢 ══ 📘\n` +
        `${line}\n` +
        `👤 𝗡𝗮𝗺𝗲    : ${botName}\n` +
        `🆔 𝗨𝗜𝗗     : ${targetID}\n` +
        `🔗 𝗩𝗮𝗻𝗶𝘁𝘆  : ${vanity}\n` +
        `⚧️ 𝗚𝗲𝗻𝗱𝗲𝗿  : ${gender}\n` +
        `🌐 𝗟𝗼𝗰𝗮𝗹𝗲  : ${locale}\n` +
        (about !== "N/A" ? `📝 𝗔𝗯𝗼𝘂𝘁   : ${about}\n` : "") +
        `🔗 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 : ${profileLink}\n` +
        `${line}\n` +
        `💰 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 : ৳${moneyFmt}\n` +
        `📊 𝗘𝗫𝗣     : ${exp.toLocaleString()}\n` +
        `🏅 𝗥𝗮𝗻𝗸    : #${rank > 0 ? rank : "N/A"} / ${sorted.length}\n` +
        `${line}\n` +
        `🤖 Ghost Net Edition — Ewr Hinata\n` +
        `👑 Owner: Rakib Islam, Saidpur`;

      const gif = "https://media.tenor.com/9kOt60U0CXUAAAAC/facebook-loading.gif";
      try {
        const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
        const st = new PassThrough();
        st.end(Buffer.from(res.data));
        await message.react("✅");
        return message.reply({ body: info, attachment: st });
      } catch {
        await message.react("✅");
        return message.reply(info);
      }
    } catch (err) {
      await message.react("❌");
      return message.reply(`❌ FB info আনতে সমস্যা: ${err.message}`);
    }
  }
};
