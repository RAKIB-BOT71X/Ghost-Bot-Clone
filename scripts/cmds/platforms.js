module.exports = {
  config: {
    name: "platforms",
    version: "2.0",
    author: "Rakib Islam",
    aliases: ["deploy", "hosting", "runbot", "botdeploy"],
    countDown: 10,
    role: 0,
    shortDescription: "Bot deployment platform guide (Replit/Render/GitHub/bby teach)",
    longDescription: "Shows how to run Ghost Bot on Replit, Render, GitHub Actions, and bby teach",
    category: "info",
    guide: { en: "{pn} [replit|render|github|bby] — Platform guide" }
  },

  onStart: async function ({ message, args }) {
    const platform = (args[0] || "all").toLowerCase();
    const sep = "═".repeat(28);

    const guides = {
      replit: [
        "🔵 REPLIT DEPLOYMENT",
        sep,
        "1. Go to replit.com",
        "2. Create new Repl → Import from GitHub",
        "3. Add Secrets:",
        "   FBSTATE = your FB cookies JSON",
        "   HF_TOKEN = HuggingFace token",
        "   SESSION_SECRET = any random string",
        "4. Run: Ghost Bot workflow",
        "5. Enable Always On (paid) or use UptimeRobot",
        "",
        "Commands:",
        "   node index.js",
        "   pnpm run dev",
        sep,
        "Tip: Use UptimeRobot to ping every 5 mins"
      ].join("\n"),

      render: [
        "🟣 RENDER.COM DEPLOYMENT",
        sep,
        "1. Go to render.com → New Web Service",
        "2. Connect your GitHub repo",
        "3. Build Command: npm install --legacy-peer-deps",
        "4. Start Command: node index.js",
        "5. Add Environment Variables:",
        "   FBSTATE = your FB cookies",
        "   HF_TOKEN = your token",
        "6. Choose Free plan → Deploy!",
        "",
        "Warning: Free tier sleeps after 15min",
        "Fix: Add health check route + UptimeRobot",
        sep
      ].join("\n"),

      github: [
        "🔷 GITHUB ACTIONS DEPLOYMENT",
        sep,
        "Use: .githubwf to get the full YAML",
        "",
        "Quick setup:",
        "1. Push bot to GitHub repo",
        "2. Create .github/workflows/bot.yml",
        "3. Use YAML from .githubwf command",
        "4. Add GitHub Secrets:",
        "   FBSTATE, HF_TOKEN, SESSION_SECRET",
        "5. Enable Actions → Run workflow",
        "",
        "Note: Free Actions has 2000 min/month",
        "Use cron: '*/5 * * * *' for 5-min intervals",
        sep
      ].join("\n"),

      bby: [
        "🌸 BBY TEACH DEPLOYMENT",
        sep,
        "1. Visit: bbybot.in",
        "2. Create account → New Project",
        "3. Upload files:",
        "   index.js, Goat.js, package.json",
        "   account.txt, scripts/, bot/ folders",
        "4. Start command: node index.js",
        "5. Add ENV variables:",
        "   HF_TOKEN, SESSION_SECRET",
        "6. Click Deploy!",
        "",
        "bby teach is free for basic bots",
        "Works great with GoatBot V2",
        sep
      ].join("\n")
    };

    if (platform === "all") {
      return message.reply([
        "👻 GHOST BOT — DEPLOYMENT PLATFORMS",
        "═".repeat(32),
        "",
        "🔵 .platforms replit   → Replit guide",
        "🟣 .platforms render   → Render.com",
        "🔷 .platforms github   → GitHub Actions",
        "🌸 .platforms bby      → bby teach",
        "",
        "Use: .githubwf for full workflow YAML",
        "═".repeat(32),
        "👻 Ghost Bot — Multi-Platform Support"
      ].join("\n"));
    }

    const guide = guides[platform];
    if (!guide) return message.reply("Unknown platform: " + platform + "\nUse: replit, render, github, bby");
    message.reply(guide);
  }
};
