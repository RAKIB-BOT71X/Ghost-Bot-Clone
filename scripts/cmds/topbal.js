const axios = require("axios");
const { PassThrough } = require("stream");

function fmtFull(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fmt(n) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

const MEDALS = ["🥇", "🥈", "🥉"];

module.exports = {
  config: {
    name: "topbal",
    aliases: ["richlist", "toprich", "balboard", "topbalance"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: "🏆 Top Balance Leaderboard",
    longDescription: "Show top 30 richest users. Use .topbal 2 for next page.",
    category: "economy",
    guide: { en: "{pn} — Top 1-30\n{pn} 2 — Top 31-60\n{pn} me — Your rank" }
  },

  onStart: async function ({ message, event, usersData, args }) {
    const { senderID } = event;

    if (args[0] === "me") {
      try {
        const allData = await usersData.getAll();
        const sorted = allData.sort((a, b) => (b.money || 0) - (a.money || 0));
        const myRank = sorted.findIndex(u => u.userID == senderID) + 1;
        const myData = sorted[myRank - 1];
        return message.reply(
          `📊 আপনার Rank:\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `👤 ${myData?.name || "Unknown"}\n` +
          `🏅 Rank: #${myRank} / ${sorted.length}\n` +
          `💰 Balance: ৳${fmtFull(myData?.money || 0)}\n` +
          `━━━━━━━━━━━━━━━━━━`
        );
      } catch {
        return message.reply("❌ Rank দেখতে সমস্যা হয়েছে।");
      }
    }

    let page = 1;
    if (args[0] === "next") {
      const stored = global._topbalPage || {};
      page = (stored[senderID] || 1) + 1;
    } else if (args[0] && !isNaN(args[0])) {
      page = parseInt(args[0]);
    }
    if (!global._topbalPage) global._topbalPage = {};
    global._topbalPage[senderID] = page;

    const perPage = 30;
    const start = (page - 1) * perPage;

    try {
      const allData = await usersData.getAll();
      if (!allData || allData.length === 0) {
        return message.reply("❌ এখনো কোনো user data নেই।");
      }

      const sorted = allData
        .filter(u => u && typeof u.money !== "undefined")
        .sort((a, b) => (b.money || 0) - (a.money || 0));

      const totalPages = Math.ceil(sorted.length / perPage);
      if (page > totalPages) {
        return message.reply(`❌ Page ${page} নেই! মোট ${totalPages} page আছে।`);
      }

      const slice = sorted.slice(start, start + perPage);
      const totalMoney = sorted.reduce((s, u) => s + (u.money || 0), 0);

      const lines = slice.map((u, i) => {
        const rank = start + i + 1;
        const medal = rank <= 3 ? MEDALS[rank - 1] : `${rank}.`;
        const name = (u.name || "Unknown").slice(0, 20);
        const bal = fmt(u.money || 0);
        return `${medal} ${name} — ৳${bal}`;
      }).join("\n");

      const header =
        `🏆 ══ 𝗧𝗢𝗣 𝗕𝗔𝗟𝗔𝗡𝗖𝗘 𝗟𝗘𝗔𝗗𝗘𝗥𝗕𝗢𝗔𝗥𝗗 ══ 🏆\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📑 Page ${page} / ${totalPages}  |  Rank #${start + 1}–#${Math.min(start + perPage, sorted.length)}\n` +
        `💎 Total Economy: ৳${fmt(totalMoney)}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

      const footer =
        `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        (page < totalPages ? `📌 Next: .topbal ${page + 1}\n` : `📌 এটাই শেষ page!\n`) +
        `👤 Your Rank: .topbal me\n` +
        `🤖 Ghost Net — Ewr Hinata`;

      const full = header + lines + footer;

      const gif = "https://media.tenor.com/PGVPmJuamVUAAAAC/trophy-award.gif";
      try {
        const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
        const st = new PassThrough();
        st.end(Buffer.from(res.data));
        return message.reply({ body: full, attachment: st });
      } catch {
        return message.reply(full);
      }
    } catch (err) {
      return message.reply("❌ Leaderboard দেখতে সমস্যা হয়েছে।");
    }
  }
};
