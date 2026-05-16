module.exports = {
  config: {
    name: "deathbattle",
    version: "2.0",
    author: "Rakib Islam",
    aliases: ["duel", "battle", "fight"],
    countDown: 10,
    role: 0,
    shortDescription: "Death battle 1v1 duel — mention/reply required",
    longDescription: "Epic 1v1 death battle with animated round-by-round combat narration",
    category: "fun",
    guide: { en: "{pn} @mention or reply to challenge someone" }
  },

  onStart: async function ({ message, event, usersData }) {
    let targetID;
    if (event.type === "message_reply") targetID = event.messageReply?.senderID;
    else if (Object.keys(event.mentions || {}).length) targetID = Object.keys(event.mentions)[0];

    if (!targetID) return message.reply("⚔️ কাউকে challenge করুন! @mention বা reply দিন।");
    if (targetID === event.senderID) return message.reply("🤣 নিজের সাথে দ্বন্দ্ব? Really?");

    const myData = await usersData.get(event.senderID);
    const targetData = await usersData.get(targetID);
    const p1 = myData?.name || "Fighter 1";
    const p2 = targetData?.name || "Fighter 2";

    const moves = ["⚡ Lightning Punch", "🔥 Fire Kick", "💀 Death Blow", "⚔️ Sword Slash", "🌪️ Tornado Spin", "💥 Explosion", "🩸 Blood Drain", "👊 Power Smash"];
    const getMove = () => moves[Math.floor(Math.random() * moves.length)];
    const getDmg = () => Math.floor(Math.random() * 30) + 20;

    let p1hp = 100, p2hp = 100;
    const rounds = [];

    for (let r = 1; r <= 3 && p1hp > 0 && p2hp > 0; r++) {
      const p1dmg = getDmg(), p2dmg = getDmg();
      p2hp = Math.max(0, p2hp - p1dmg);
      p1hp = Math.max(0, p1hp - p2dmg);
      rounds.push(`🔴 Round ${r}:\n   ${p1} → ${getMove()} (${p1dmg} dmg)\n   ${p2} → ${getMove()} (${p2dmg} dmg)`);
    }

    const winner = p1hp >= p2hp ? p1 : p2;
    const loser = winner === p1 ? p2 : p1;

    const msg = `⚔️ ᴅᴇᴀᴛʜ ʙᴀᴛᴛʟᴇ ⚔️\n${"━".repeat(26)}\n\n🥊 ${p1} ── vs ── ${p2} 🥊\n\n${"━".repeat(26)}\n\n${rounds.join("\n\n")}\n\n${"━".repeat(26)}\n🏆 WINNER: ${winner}\n💀 LOSER: ${loser}\n\n❤️ ${p1}: ${p1hp}hp remaining\n❤️ ${p2}: ${p2hp}hp remaining\n\n⚔️ "Only the strongest survive!"`;

    await message.reply({
      body: msg,
      mentions: [
        { tag: p1, id: event.senderID, fromIndex: msg.indexOf(p1) },
        { tag: p2, id: targetID, fromIndex: msg.lastIndexOf(p2) }
      ]
    });
  }
};
