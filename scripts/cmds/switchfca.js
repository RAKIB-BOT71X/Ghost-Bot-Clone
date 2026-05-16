const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

const ACTIVE_FILE = path.join(process.cwd(), "fca-modules", "active.json");

function getActive() {
  try { return (fs.readJsonSync(ACTIVE_FILE).active || "fca1").trim(); }
  catch { return "fca1"; }
}

module.exports = {
  config: {
    name: "switchfca",
    aliases: ["fca", "fcaswitch", "setfca"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 2,
    shortDescription: "FCA status দেখো",
    longDescription: "Currently active FCA module এর status দেখো। Ghost Net Edition এ শুধু fca1 (Sx69x Original) active।",
    category: "owner",
    guide: "{pn} [status]",
  },
  onStart: async function ({ message }) {
    const current = getActive();
    return message.reply(
      `👻 𝗚𝗵𝗼𝘀𝘁 𝗕𝗼𝘁 — FCA Manager\n` +
      `━━━━━━━━━━━━━━━━━\n\n` +
      `⚡ fca1: Sx69x FCA (Original) ◄ ACTIVE\n` +
      `   Stability: High\n` +
      `   Anti-ban: Medium\n` +
      `   Speed: Fast\n\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `📌 Active: ${current} — Sx69x Original\n\n` +
      `ℹ️ Ghost Net Edition এ fca1 ই default ও recommended।\n` +
      `অন্য FCA install করা নেই।\n\n` +
      `👤 Owner: ${GHOST.ownerName}`
    );
  }
};
