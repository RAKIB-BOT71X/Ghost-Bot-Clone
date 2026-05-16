const fs = require("fs-extra");
const path = require("path");
const SETTINGS_PATH = path.join(process.cwd(), "data", "ghostSettings.json");

function loadSettings() {
  if (!fs.existsSync(SETTINGS_PATH)) return {};
  try { return fs.readJsonSync(SETTINGS_PATH); } catch { return {}; }
}
function saveSettings(data) {
  fs.ensureDirSync(path.dirname(SETTINGS_PATH));
  fs.writeJsonSync(SETTINGS_PATH, data, { spaces: 2 });
}

module.exports = {
  config: {
    name: "stop",
    aliases: ["stopbot", "botoff", "freeze"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 1,
    shortDescription: "Stop bot in group — Admin only 🛑",
    longDescription: "Stops bot from responding in the group. Only admin can use/resume.",
    category: "admin", guide: { en: "{pn} — Stop | {pn} resume — Resume" }
  },
  onStart: async function ({ message, event, args }) {
    const { threadID } = event;
    const adminBot = global.GoatBot?.config?.adminBot || [];
    const threadData = global.db?.allThreadData?.find(t => t.threadID == threadID);
    const adminIDs = (threadData?.adminIDs || []).map(a => a.adminID || a);
    const isAdmin = adminBot.includes(event.senderID) || adminIDs.includes(event.senderID);
    if (!isAdmin) return message.reply("❌ শুধু Admin এই command use করতে পারবে!\n👻 Ghost Net");

    const s = loadSettings();
    if (!s[threadID]) s[threadID] = {};

    if (args[0] === "resume" || args[0] === "start" || args[0] === "on") {
      s[threadID].botStopped = false;
      saveSettings(s);
      return message.reply("✅ Bot resumed!\n🤖 Bot is now active in this group!\n👻 Ghost Net | Rakib Islam");
    }

    s[threadID].botStopped = true;
    saveSettings(s);
    return message.reply(
      `🛑 Bot stopped in this group!\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `❌ Bot will NOT respond to any commands.\n` +
      `✅ Use .stop resume to bring bot back.\n` +
      `⚠️ Only admin can resume!\n` +
      `👻 Ghost Net | Rakib Islam`
    );
  }
};
