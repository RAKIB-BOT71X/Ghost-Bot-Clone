const axios = require("axios");

const attacks = [
  { name: "Plasma Cannon", emoji: "⚡", power: () => Math.floor(Math.random() * 5000) + 8000, color: "🔵" },
  { name: "Ghost Strike", emoji: "👻", power: () => Math.floor(Math.random() * 7000) + 9000, color: "🟣" },
  { name: "Soul Reaper", emoji: "💀", power: () => Math.floor(Math.random() * 6000) + 10000, color: "⚫" },
  { name: "Thunder God", emoji: "⚡", power: () => Math.floor(Math.random() * 4000) + 8500, color: "🟡" },
  { name: "Dragon Flame", emoji: "🔥", power: () => Math.floor(Math.random() * 5500) + 9500, color: "🔴" },
  { name: "Void Blast", emoji: "🌌", power: () => Math.floor(Math.random() * 6500) + 11000, color: "🟤" },
  { name: "Blood Moon", emoji: "🌑", power: () => Math.floor(Math.random() * 4500) + 8000, color: "🔴" },
  { name: "Demon Slash", emoji: "⚔️", power: () => Math.floor(Math.random() * 7500) + 12000, color: "🟥" }
];

const finishers = [
  "💀 OBLITERATED!", "⚰️ DESTROYED!", "🔥 ANNIHILATED!", "💥 DEVASTATED!",
  "🌑 ELIMINATED!", "👻 GHOSTED!", "⚡ FRIED!", "🩸 FINISHED!"
];

module.exports = {
  config: {
    name: "attack",
    version: "2.0",
    author: "Rakib Islam",
    aliases: ["strike", "smash", "blast", "destroy"],
    countDown: 5,
    role: 0,
    shortDescription: "Deadly attack command — mention/reply required",
    longDescription: "Launch a devastating attack on a mentioned/replied user with power stats and finishing moves",
    category: "fun",
    guide: { en: "{pn} @mention or reply to attack someone" }
  },

  onStart: async function ({ message, event, usersData }) {
    let targetID;
    if (event.type === "message_reply") targetID = event.messageReply?.senderID;
    else if (Object.keys(event.mentions || {}).length) targetID = Object.keys(event.mentions)[0];

    if (!targetID) return message.reply("⚔️ কাউকে @mention করুন অথবা কারো message এ reply দিন!\nExample: .attack @name");
    if (targetID === event.senderID) return message.reply("🤣 নিজেকে attack করবেন? সেটা কি ভালো হবে? 😅");

    const myData = await usersData.get(event.senderID);
    const targetData = await usersData.get(targetID);
    const myName = myData?.name || "Attacker";
    const targetName = targetData?.name || "Target";

    const attack = attacks[Math.floor(Math.random() * attacks.length)];
    const power = attack.power();
    const crit = Math.random() > 0.7;
    const finalPower = crit ? power * 2 : power;
    const finisher = finishers[Math.floor(Math.random() * finishers.length)];

    const hpBar = "❤️".repeat(3) + "🖤".repeat(7);
    const dmgBar = "💥".repeat(Math.min(10, Math.floor(finalPower / 2000)));

    const msg = `${attack.emoji} ᴅᴇᴀᴅʟʏ ᴀᴛᴛᴀᴄᴋ ${attack.emoji}\n${"═".repeat(26)}\n\n⚔️ ${myName}\n   ↓ Launches ${attack.name}!\n💀 ${targetName}\n\n${crit ? "🔥 CRITICAL HIT!! (×2 DAMAGE)\n" : ""}💢 Damage: ${finalPower.toLocaleString()} HP\n${dmgBar}\n\n❤️ ${targetName}'s HP:\n[${hpBar}]\n0% — ${finisher}\n\n${"═".repeat(26)}\n👻 Ghost Bot Battle System`;

    await message.reply({
      body: msg,
      mentions: [
        { tag: myName, id: event.senderID, fromIndex: msg.indexOf(myName) },
        { tag: targetName, id: targetID, fromIndex: msg.lastIndexOf(targetName) }
      ]
    });
  }
};
