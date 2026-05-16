const { commands, aliases } = global.GoatBot;
const { getPrefix } = global.utils;

const ICONS = {
  "info": "💡", "fun": "🎪", "game": "🎮", "system": "⚙️", "prank": "🃏",
  "image": "🖼️", "anime": "🌸", "media": "🎬", "admin": "👑", "box chat": "💬",
  "owner": "🎀", "music": "🎵", "free fire": "🔫", "utility": "🛠️",
  "ai": "🤖", "love": "💕", "custom": "💎", "ghost net": "👻",
  "18+": "🔞", "without prefix": "🚫", "rank": "🏆", "noprefix": "🚫",
  "marry": "💍", "information": "📋", "image generator": "🎨",
  "image generator 2": "🖌️", "economy": "💰", "convert": "🔄",
  "tools": "🔧", "chat": "💬", "group": "👥", "no prefix": "🚫",
  "বাংলা": "🇧🇩", "utility-bd": "🔧", "game-bd": "🕹️",
  "social": "🤝", "info-bd": "📚", "text-tools": "✍️"
};

const PAGE2_CATS = ["বাংলা", "utility-bd", "game-bd", "social", "info-bd", "text-tools"];

const WAIFU_IMAGES = [
  "https://i.imgur.com/6S6Mh8S.jpg",
  "https://i.imgur.com/9v6N0mI.jpg",
  "https://i.imgur.com/3Z7N6yL.jpg",
  "https://i.imgur.com/Qp7Nf6B.jpg",
  "https://i.imgur.com/uT0mB8p.jpg"
];

module.exports = {
  config: {
    name: "help",
    version: "4.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 0,
    shortDescription: { en: "Clean & cute help menu" },
    longDescription: { en: "All-in-one command list with clean design" },
    category: "info",
    guide: { en: "{p}help [command | 1 | 2]" },
    priority: 1
  },

  onStart: async function ({ message, args, event, role }) {
    const prefix = getPrefix(event.threadID);

    if (args.length && isNaN(args[0]) && !["all", "list", "cat"].includes(args[0].toLowerCase())) {
      const q = args[0].toLowerCase();
      const cmd = commands.get(q) || commands.get(aliases.get(q));
      if (cmd) return showCmd(message, cmd, prefix);
      return message.reply(`❌ Command "${args[0]}" পাওয়া যায়নি!\n💡 সব commands দেখতে: ${prefix}help`);
    }

    const pageNum = args[0] === "2" ? 2 : 1;

    const cats = {};
    for (const [name, cmd] of commands) {
      if (cmd.config.role > 1 && role < cmd.config.role) continue;
      const c = (cmd.config.category || "uncategorized").toLowerCase();
      (cats[c] = cats[c] || []).push(name);
    }

    let filteredCats = {};
    if (pageNum === 2) {
      for (const c of PAGE2_CATS) {
        if (cats[c]) filteredCats[c] = cats[c];
      }
    } else {
      for (const [c, v] of Object.entries(cats)) {
        if (!PAGE2_CATS.includes(c)) filteredCats[c] = v;
      }
    }

    const p2count = PAGE2_CATS.reduce((s, c) => s + (cats[c] || []).length, 0);
    const totalCmds = commands.size;

    let msg = "";

    if (pageNum === 1) {
      msg += `╔══════════════════════╗\n`;
      msg += `║  🍡 GoatBot Help Menu  ║\n`;
      msg += `╚══════════════════════╝\n`;
      msg += `\n`;
      msg += `  ✦ Prefix  ›  ${prefix}\n`;
      msg += `  ✦ Commands ›  ${totalCmds} টি\n`;
      msg += `  ✦ Page    ›  1 / 2\n`;
      msg += `  ✦ BD Cmds  ›  ${prefix}help 2\n`;
      msg += `\n`;
      msg += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
    } else {
      msg += `╔══════════════════════╗\n`;
      msg += `║  🇧🇩 বাংলাদেশি কমান্ড  ║\n`;
      msg += `╚══════════════════════╝\n`;
      msg += `\n`;
      msg += `  ✦ Prefix  ›  ${prefix}\n`;
      msg += `  ✦ BD Cmds ›  ${p2count} টি\n`;
      msg += `  ✦ Page    ›  2 / 2\n`;
      msg += `  ✦ Main    ›  ${prefix}help 1\n`;
      msg += `\n`;
      msg += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
    }

    const sortedCats = Object.keys(filteredCats).sort();
    for (const c of sortedCats) {
      const icon = ICONS[c] || "🌟";
      const list = filteredCats[c].sort();
      msg += `\n${icon} ${c.toUpperCase()}\n`;
      msg += `${"─".repeat(22)}\n`;

      for (let i = 0; i < list.length; i += 3) {
        const row = list.slice(i, i + 3);
        const line = row.map(r => `› ${r}`).join("  ");
        msg += `${line}\n`;
      }
    }

    msg += `\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
    msg += `💡 ${prefix}help <command> — command info\n`;
    msg += `👤 Owner: Rakib Islam\n`;
    msg += `🔗 fb.com/profile.php?id=61575436812912`;

    const randomWaifu = WAIFU_IMAGES[Math.floor(Math.random() * WAIFU_IMAGES.length)];
    try {
      const imgStream = await global.utils.getStreamFromURL(randomWaifu);
      return message.reply({ body: msg, attachment: imgStream });
    } catch {
      return message.reply(msg);
    }
  }
};

function showCmd(message, cmd, prefix) {
  const c = cmd.config;
  const guide = typeof c.guide === "string" ? c.guide : (c.guide?.en || "—");
  const sd = typeof c.shortDescription === "string" ? c.shortDescription : (c.shortDescription?.en || "—");
  const al = (c.aliases || []).join(", ") || "—";
  const roles = ["👤 User", "🔧 Mod", "👑 Admin", "💎 Owner"];

  const m =
`╔════════════════════╗
║   🎀 Command Info   ║
╚════════════════════╝

  🍭 Name     ›  ${c.name}
  🔖 Aliases  ›  ${al}
  📂 Category ›  ${c.category || "—"}
  ✏️  Author   ›  ${c.author || "—"}
  🔐 Role     ›  ${roles[c.role || 0]}
  ⏳ Cooldown ›  ${c.countDown || 0}s

┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄

  📝 ${sd}

  💡 Usage:
  ${guide.replace(/\{p\}|\{pn\}/g, prefix + c.name + " ")}

┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
👻 Ghost Net Edition`;

  return message.reply(m);
}
