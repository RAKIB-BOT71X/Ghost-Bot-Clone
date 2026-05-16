module.exports = {
  config: {
    name: "shadowhack",
    version: "2.0",
    author: "Rakib Islam",
    aliases: ["ghack", "fakehack", "hacker"],
    countDown: 5,
    role: 0,
    shortDescription: "Fake hacking simulation with terminal output",
    longDescription: "Simulates an epic hacking sequence targeting a mentioned user — pure fun, completely fake",
    category: "fun",
    guide: { en: "{pn} @mention or reply to hack someone" }
  },

  onStart: async function ({ message, event, usersData }) {
    let targetID;
    if (event.type === "message_reply") targetID = event.messageReply?.senderID;
    else if (Object.keys(event.mentions || {}).length) targetID = Object.keys(event.mentions)[0];

    if (!targetID) return message.reply("💻 কাউকে @mention করুন অথবা কারো message reply দিন!");

    const targetData = await usersData.get(targetID);
    const targetName = targetData?.name || "Target";

    const fakeIP = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".");
    const fakeMAC = () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join(":").toUpperCase();
    const fakeHash = () => Math.random().toString(36).substring(2, 18).toUpperCase();
    const fakePwd = () => Math.random().toString(36).substring(2, 14) + "@" + Math.floor(Math.random() * 999);

    const steps = [
      `[INIT] Locating target: ${targetName}...`,
      `[SCAN] IP Found: ${fakeIP()}`,
      `[SCAN] MAC: ${fakeMAC()}`,
      `[CRACK] Bypassing firewall... ██████████ 100%`,
      `[ACCESS] Entering system... ████████░░ 82%`,
      `[DUMP] Password hash: ${fakeHash()}`,
      `[CRACK] Decrypting... password: ${fakePwd()}`,
      `[DATA] Downloading personal files... Done`,
      `[GHOST] Clearing traces... ✓`,
      `[DONE] Hack complete! Target compromised 💀`
    ];

    message.reply(`💻 ʜᴀᴄᴋɪɴɢ: ${targetName} 💻\n${"▓".repeat(26)}\n\n${steps.join("\n")}\n\n${"▓".repeat(26)}\n⚠️ (This is 100% FAKE — for fun only 😂)\n👻 Shadow Hack by Ghost Bot`);
  }
};
