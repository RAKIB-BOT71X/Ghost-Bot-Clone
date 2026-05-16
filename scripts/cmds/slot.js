const axios = require("axios");
const { PassThrough } = require("stream");

function fmtFull(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function parseAmount(str) {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/,/g, "");
  if (str.endsWith("b")) return parseFloat(str) * 1_000_000_000;
  if (str.endsWith("m")) return parseFloat(str) * 1_000_000;
  if (str.endsWith("k")) return parseFloat(str) * 1_000;
  return parseFloat(str);
}

const SYMBOLS = ["🍒", "🍋", "🍊", "🔔", "⭐", "💎", "7️⃣", "🎯"];

module.exports = {
  config: {
    name: "slot",
    aliases: ["slots", "slotmachine"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    category: "game",
    shortDescription: "🎰 Slot Machine Game",
    longDescription: "Spin the slot machine! Bet coins and win big. 3 same = 5x, 2 same = 2x, all different = lose.",
    guide: { en: "{pn} <amount> — Spin!\nExample: .slot 50000\nSupports: 1M, 500K, 1B" }
  },

  onStart: async function ({ message, event, usersData, args }) {
    const { senderID } = event;

    const amtStr = args[0];
    const bet = Math.round(parseAmount(amtStr));

    if (!bet || isNaN(bet) || bet <= 0) {
      const gif = "https://media.tenor.com/IgGxBTDLWGsAAAAC/slot-machine-casino.gif";
      try {
        const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 6000 });
        const st = new PassThrough(); st.end(Buffer.from(res.data));
        return message.reply({
          body: `🎰 Slot Machine!\n\n` +
                `📌 Usage: .slot <amount>\n` +
                `📌 Example: .slot 50000 | .slot 1M | .slot 500K\n\n` +
                `🍒 2 same = 2x bet\n` +
                `⭐ 3 same = 5x bet\n` +
                `💎 3 diamonds = 10x bet!\n` +
                `7️⃣ Triple 7 = JACKPOT 20x!`,
          attachment: st
        });
      } catch {
        return message.reply(`🎰 Usage: .slot <amount>\nExample: .slot 50000 | .slot 1M`);
      }
    }

    if (bet < 1000)  return message.reply("❌ Minimum bet: ৳1,000");
    if (bet > 500_000_000) return message.reply("❌ Maximum bet: ৳500M");

    try {
      let userData = await usersData.get(senderID);
      let userMoney = userData?.money ?? 0;

      if (userMoney <= 0) {
        userMoney = 1_000_000_000;
        await usersData.addMoney(senderID, userMoney);
      }

      if (userMoney < bet) {
        return message.reply(
          `❌ যথেষ্ট balance নেই!\n` +
          `আপনার Balance: ৳${fmtFull(userMoney)}\n` +
          `Bet: ৳${fmtFull(bet)}\n\n` +
          `💡 .bal দিয়ে balance check করুন`
        );
      }

      const spin = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

      let s1 = spin(), s2 = spin(), s3 = spin();

      const rand = Math.random();
      if (rand < 0.15) { s1 = s2 = s3 = spin(); }
      else if (rand < 0.40) { s1 = s2 = spin(); s3 = spin(); while (s3 === s1) s3 = spin(); }

      let multiplier = 0;
      let resultMsg = "";

      if (s1 === s2 && s2 === s3) {
        if (s1 === "7️⃣") { multiplier = 20; resultMsg = "🎉 𝗝𝗔𝗖𝗞𝗣𝗢𝗧! TRIPLE 7! 20x! 🎊"; }
        else if (s1 === "💎") { multiplier = 10; resultMsg = "💎 𝗧𝗥𝗜𝗣𝗟𝗘 𝗗𝗜𝗔𝗠𝗢𝗡𝗗! 10x! 💎"; }
        else { multiplier = 5; resultMsg = `🎯 𝗧𝗥𝗜𝗣𝗟𝗘 𝗠𝗔𝗧𝗖𝗛! 5x! ${s1}${s1}${s1}`; }
      } else if (s1 === s2 || s1 === s3 || s2 === s3) {
        multiplier = 2;
        resultMsg = `✅ 𝗗𝗢𝗨𝗕𝗟𝗘 𝗠𝗔𝗧𝗖𝗛! 2x!`;
      } else {
        multiplier = 0;
        resultMsg = `😢 𝗡𝗢 𝗠𝗔𝗧𝗖𝗛! Better luck next time!`;
      }

      let newMoney;
      if (multiplier > 0) {
        const prize = bet * multiplier;
        await usersData.addMoney(senderID, prize - bet);
        newMoney = userMoney - bet + prize;
      } else {
        await usersData.subtractMoney(senderID, bet);
        newMoney = userMoney - bet;
      }

      const prizeText = multiplier > 0
        ? `🏆 Won: ৳${fmtFull(bet * multiplier)} (+৳${fmtFull(bet * (multiplier - 1))})`
        : `💸 Lost: ৳${fmtFull(bet)}`;

      const body =
        `🎰 ══ 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘 ══ 🎰\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `╔════════════════════╗\n` +
        `║  ${s1} │ ${s2} │ ${s3}  ║\n` +
        `╚════════════════════╝\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `${resultMsg}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💰 Bet   : ৳${fmtFull(bet)}\n` +
        `${prizeText}\n` +
        `📊 Balance: ৳${fmtFull(Math.max(0, newMoney))}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🤖 Ghost Net — .slot <amount> to play again`;

      const gif = "https://media.tenor.com/IgGxBTDLWGsAAAAC/slot-machine-casino.gif";
      try {
        const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
        const st = new PassThrough(); st.end(Buffer.from(res.data));
        return message.reply({ body, attachment: st });
      } catch {
        return message.reply(body);
      }
    } catch (err) {
      return message.reply("❌ Slot game এ সমস্যা হয়েছে। আবার try করুন।");
    }
  }
};
