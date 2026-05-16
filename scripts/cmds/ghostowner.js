const axios = require("axios");

const OWNER_GIF = [
  "https://media.tenor.com/MXpCPdMKn8IAAAAC/anime-hacker.gif",
  "https://media.tenor.com/7N-PcvGZsYMAAAAC/dark-anime.gif",
  "https://media.tenor.com/oMa1m_TzwVkAAAAC/anime-cool.gif",
  "https://media.tenor.com/p5gbLxCzB7cAAAAC/demon-slayer.gif",
  "https://media.tenor.com/Ck5DFa5BAFYAAAAC/ghost-anime.gif"
];

const ownerCards = [
  {
    tag: "👻 GHOST BOT — OWNER PROFILE",
    icon: "🔱",
    content: (o) => `🔱 ᴏᴡɴᴇʀ ᴘʀᴏꜰɪʟᴇ 🔱\n${"═".repeat(26)}\n\n👤 Name    : ${o.name}\n🆔 UID     : ${o.uid}\n📱 FB      : ${o.fb}\n🌍 Country : ${o.country}\n💼 Role    : ${o.role}\n📅 Since   : ${o.since}\n\n${"═".repeat(26)}\n💬 "${o.quote}"`
  },
  {
    tag: "💎 GHOST NET — DEV INFO",
    icon: "⚡",
    content: (o) => `⚡ ᴅᴇᴠᴇʟᴏᴘᴇʀ ᴄᴀʀᴅ ⚡\n${"▬".repeat(26)}\n\n🧑‍💻 Dev Name : ${o.name}\n🌐 Language : Bangla / English\n💻 Stack    : Node.js, GoatBot\n🎯 Specialty: FB Bot Dev\n📦 Bots Made: 10+\n🔥 Status   : Active\n\n${"▬".repeat(26)}\n🚀 "Code is my superpower"`
  },
  {
    tag: "🌹 OWNER CONTACT CARD",
    icon: "📞",
    content: (o) => `📞 ᴄᴏɴᴛᴀᴄᴛ ᴏᴡɴᴇʀ 📞\n${"─".repeat(26)}\n\n👤 ${o.name}\n📘 Facebook : ${o.fb}\n📧 Email    : ${o.email}\n🌍 Country  : ${o.country}\n⏰ Active   : 24/7\n\n${"─".repeat(26)}\n💌 "DM me anytime, I respond fast!"`
  },
  {
    tag: "🏆 GHOST OWNER RANK",
    icon: "🏅",
    content: (o) => `🏅 ᴏᴡɴᴇʀ ʀᴀɴᴋ ᴄᴀʀᴅ 🏅\n${"◈".repeat(26)}\n\n👑 ${o.name}\n🎖️ Rank     : Supreme Admin\n💪 Power    : Full Control\n🌟 Stars    : ⭐⭐⭐⭐⭐\n🔒 Bot Lock : Set by Owner\n⚔️ Access   : God Mode\n\n${"◈".repeat(26)}\n🔱 "The ghost who runs the machine"`
  },
  {
    tag: "🌙 OWNER SECRET CARD",
    icon: "🕵️",
    content: (o) => `🕵️ ꜱᴇᴄʀᴇᴛ ꜰɪʟᴇ — ᴏᴡɴᴇʀ 🕵️\n${"░".repeat(26)}\n\n[CLASSIFIED]\n\n👤 Alias    : ${o.name}\n🌍 Origin   : ${o.country}\n🤖 Codename : Ghost Net\n🔑 Access   : Unrestricted\n📡 Signal   : Always On\n\n${"░".repeat(26)}\n👻 "I am the ghost in the machine"`
  }
];

const ownerData = {
  name: "Rakib Islam",
  uid: "61575436812912",
  fb: "fb.com/rakibislam",
  email: "rakib@ghostbot.dev",
  country: "Bangladesh 🇧🇩",
  role: "Supreme Bot Owner",
  since: "2024",
  quote: "I build bots, bots build worlds."
};

module.exports = {
  config: {
    name: "ghostowner",
    version: "3.0",
    author: "Rakib Islam",
    aliases: ["botowner", "whosmyboss", "ownerinfo"],
    countDown: 10,
    role: 0,
    shortDescription: "Ghost Bot owner info cards (5 animated)",
    longDescription: "Shows 5 unique animated GIF cards with Ghost Bot owner Rakib Islam's details",
    category: "info",
    guide: { en: "{pn} — Shows owner card\n{pn} 2/3/4/5 — Different card styles" }
  },

  onStart: async function ({ message, args }) {
    const idx = Math.min(Math.max((parseInt(args[0]) || 1) - 1, 0), 4);
    const card = ownerCards[idx];
    const gif = OWNER_GIF[idx];

    const body = `${card.tag}\n\n${card.content(ownerData)}\n\n🔢 Card ${idx + 1}/5 | .ghostowner 1-5`;

    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const stream = require("stream");
      const readable = new stream.PassThrough();
      readable.end(Buffer.from(res.data));
      message.reply({ body, attachment: readable });
    } catch {
      message.reply(body);
    }
  }
};
