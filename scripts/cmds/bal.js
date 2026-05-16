const axios = require("axios");
const { PassThrough } = require("stream");
const path = require("path");
const fs = require("fs-extra");

const ADMIN_BALANCE = 5_000_000_000;
const USER_BALANCE   = 1_000_000_000;

function fmt(n) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function fmtFull(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function cardNum(uid) {
  const d = uid.toString();
  return `•••• •••• •••• ${d.slice(-4)}`;
}

function expiry() {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 3}`;
}

module.exports = {
  config: {
    name: "bal",
    aliases: ["balance", "money", "wallet"],
    version: "4.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "💳 Mastercard balance card",
    longDescription: "See your Mastercard-style balance card. New users get starting balance automatically.",
    category: "economy",
    guide: { en: "{pn} | {pn} @mention | {pn} reply" }
  },

  onStart: async function ({ message, event, usersData, api }) {
    const { senderID, mentions, messageReply } = event;

    let targetID = senderID;
    const mentionKeys = Object.keys(mentions || {});
    if (mentionKeys.length > 0) targetID = mentionKeys[0];
    else if (messageReply?.senderID) targetID = messageReply.senderID;

    try {
      let userData = await usersData.get(targetID);
      const name = userData?.name || "Unknown User";
      let money = userData?.money ?? 0;

      const config = global.GoatBot?.config || {};
      const adminList = config.adminBot || [];
      const masterUID = config.masterUID || "";
      const isAdmin = adminList.includes(targetID) || targetID === masterUID;

      if (money <= 0) {
        const startBal = isAdmin ? ADMIN_BALANCE : USER_BALANCE;
        await usersData.addMoney(targetID, startBal);
        money = startBal;
      }

      const allData = await usersData.getAll();
      const sorted = allData.sort((a, b) => (b.money || 0) - (a.money || 0));
      const rank = sorted.findIndex(u => u.userID == targetID) + 1;
      const total = sorted.length;
      const status = isAdmin ? "👑 ADMIN VIP" : money >= 1_000_000_000 ? "💎 RICH" : "⭐ REGULAR";
      const isSelf = targetID === senderID;

      const line = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

      const card =
        `${line}\n` +
        `   💳 𝗘𝗪𝗥 𝗛𝗜𝗡𝗔𝗧𝗔 — 𝗠𝗔𝗦𝗧𝗘𝗥𝗖𝗔𝗥𝗗 𝗕𝗢𝗧\n` +
        `${line}\n` +
        `   ◉◉◉◉  ◉◉◉◉  ◉◉◉◉  GHOST NET\n\n` +
        `   👤 𝗡𝗮𝗺𝗲   : ${name}\n` +
        `   🔑 𝗖𝗮𝗿𝗱   : ${cardNum(targetID)}\n` +
        `   📅 𝗩𝗮𝗹𝗶𝗱  : ${expiry()}\n` +
        `${line}\n` +
        `   💰 𝗕𝗔𝗟𝗔𝗡𝗖𝗘\n` +
        `   ৳ ${fmtFull(money)}  (${fmt(money)})\n` +
        `${line}\n` +
        `   🏅 𝗥𝗮𝗻𝗸   : #${rank} / ${total}\n` +
        `   🎖️ 𝗦𝘁𝗮𝘁𝘂𝘀 : ${status}\n` +
        `${line}\n` +
        `   🤖 Ghost Net Edition — Ewr Hinata\n` +
        `   👑 Owner: Rakib Islam, Saidpur\n` +
        `${line}`;

      const gif = "https://media.tenor.com/j1X_eJkrgLEAAAAC/money-cash.gif";
      try {
        const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
        const st = new PassThrough();
        st.end(Buffer.from(res.data));
        const label = isSelf ? "আপনার" : `${name} এর`;
        return message.reply({ body: `💳 ${label} Balance Card:\n\n${card}`, attachment: st });
      } catch {
        return message.reply(`💳 Balance Card:\n\n${card}`);
      }
    } catch (err) {
      return message.reply("❌ Balance দেখতে সমস্যা হয়েছে। আবার try করুন।");
    }
  }
};
