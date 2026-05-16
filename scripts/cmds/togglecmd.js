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
    name: "togglecmd",
    aliases: ["cmdtoggle", "cmdon", "cmdoff", "enablecmd", "disablecmd"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 1,
    shortDescription: "Toggle any command on/off in group 🔧",
    longDescription: "Enable or disable specific commands in the group. Admin only.",
    category: "admin", guide: { en: "{pn} <cmdname> on/off" }
  },
  onStart: async function ({ message, event, args }) {
    const { threadID, senderID } = event;
    const adminBot = global.GoatBot?.config?.adminBot || [];
    const threadData = global.db?.allThreadData?.find(t => t.threadID == threadID);
    const adminIDs = (threadData?.adminIDs || []).map(a => a.adminID || a);
    const isAdmin = adminBot.includes(senderID) || adminIDs.includes(senderID);
    if (!isAdmin) return message.reply("❌ শুধু Admin ব্যবহার করতে পারবে!");

    if (!args[0] || !args[1]) return message.reply(
      "🔧 Command Toggle\n━━━━━━━━━━━━━━\n" +
      "Usage: .togglecmd <command> on/off\n\n" +
      "Example:\n  .togglecmd flirt off\n  .togglecmd flirt on\n\n" +
      "👻 Ghost Net | Rakib Islam"
    );

    const cmdName = args[0].toLowerCase();
    const action = args[1].toLowerCase();
    if (!["on","off"].includes(action)) return message.reply("❌ 'on' বা 'off' দিন!");

    const s = loadSettings();
    if (!s[threadID]) s[threadID] = {};
    if (!s[threadID].disabledCmds) s[threadID].disabledCmds = [];

    if (action === "off") {
      if (!s[threadID].disabledCmds.includes(cmdName)) s[threadID].disabledCmds.push(cmdName);
      saveSettings(s);
      return message.reply(`🔴 Command '${cmdName}' disabled in this group!\n👻 Ghost Net | Rakib Islam`);
    } else {
      s[threadID].disabledCmds = s[threadID].disabledCmds.filter(c => c !== cmdName);
      saveSettings(s);
      return message.reply(`🟢 Command '${cmdName}' enabled in this group!\n👻 Ghost Net | Rakib Islam`);
    }
  }
};
