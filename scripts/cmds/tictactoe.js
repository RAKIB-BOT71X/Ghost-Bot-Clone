/*
  🎮 TIC-TAC-TOE — Image Board
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  .ttt              → AI আগে চাল দেবে
  .ttt f            → তুমি আগে (board দেখে চাল দাও)
  .ttt f 9          → তুমি আগে, সাথে সাথে ৯ নম্বরে
  .ttt f 9 50000    → bet সহ ৯ তে চাল
  .ttt 50000        → AI আগে, bet দিয়ে
  .ttt @mention     → অন্যজনের সাথে
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cell layout:
    1 | 2 | 3
    4 | 5 | 6
    7 | 8 | 9
*/

"use strict";

const fs   = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

// ── Image drawing ────────────────────────────────────────────────────────────

function setPixel(data, W, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= W) return;
  const i = (y * W + x) * 4;
  data[i] = r; data[i+1] = g; data[i+2] = b; data[i+3] = a;
}

function fillRect(img, W, x, y, w, h, r, g, b) {
  for (let dy = 0; dy < h; dy++)
    for (let dx = 0; dx < w; dx++)
      setPixel(img, W, x+dx, y+dy, r, g, b);
}

function drawLine(img, W, x1, y1, x2, y2, r, g, b, thick = 1) {
  const dx = Math.abs(x2-x1), dy = Math.abs(y2-y1);
  const sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1;
  let err = dx - dy, cx = x1, cy = y1;
  const h = Math.floor(thick / 2);
  while (true) {
    for (let ty = -h; ty <= h; ty++)
      for (let tx = -h; tx <= h; tx++)
        setPixel(img, W, cx+tx, cy+ty, r, g, b);
    if (cx === x2 && cy === y2) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; cx += sx; }
    if (e2 <  dx) { err += dx; cy += sy; }
  }
}

function drawCircleRing(img, W, cx, cy, radius, thick, r, g, b) {
  for (let t = 0; t < thick; t++) {
    const rad = radius - t;
    if (rad <= 0) break;
    let x = rad, y = 0, err = 0;
    while (x >= y) {
      for (const [px, py] of [[x,y],[-x,y],[x,-y],[-x,-y],[y,x],[-y,x],[y,-x],[-y,-x]])
        setPixel(img, W, cx+px, cy+py, r, g, b);
      if (err <= 0) { y++; err += 2*y+1; }
      else          { x--; err -= 2*x+1; }
    }
  }
}

async function makeBoardImage(cells) {
  const { Jimp, loadFont } = require("jimp");

  const SZ   = 600;   // total image
  const CELL = 200;   // cell size
  const LINE = 6;     // grid line width
  const W    = SZ;

  const img = new Jimp({ width: SZ, height: SZ, color: 0x1a1a2eff });
  const data = img.bitmap.data;

  // Cell backgrounds
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const shade = (row + col) % 2 === 0 ? [0x16,0x21,0x3e] : [0x0f,0x17,0x2a];
      fillRect(data, W, col*CELL+3, row*CELL+3, CELL-6, CELL-6, shade[0], shade[1], shade[2]);
    }
  }

  // Grid lines
  for (let i = 1; i < 3; i++) {
    fillRect(data, W, i*CELL - LINE/2|0, 0, LINE, SZ, 0x44,0x55,0x88);
    fillRect(data, W, 0, i*CELL - LINE/2|0, SZ, LINE, 0x44,0x55,0x88);
  }

  // Load font for numbers
  let font64 = null;
  try {
    const pnpm = path.join(__dirname, "../../node_modules/.pnpm");
    const dir  = fs.readdirSync(pnpm).find(d => d.startsWith("@jimp+plugin-print@"));
    if (dir) {
      const fnt = path.join(pnpm, dir, "node_modules/@jimp/plugin-print/dist/fonts/open-sans/open-sans-64-white/open-sans-64-white.fnt");
      font64 = await loadFont(fnt);
    }
  } catch (_) {}

  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const cx  = col * CELL + CELL / 2;
    const cy  = row * CELL + CELL / 2;
    const val = cells[i];

    if (val === "X") {
      const r = 72; // arm reach
      // Red X — two thick diagonals with glow
      drawLine(data, W, cx-r, cy-r, cx+r, cy+r, 0xff,0x55,0x55, 16);
      drawLine(data, W, cx+r, cy-r, cx-r, cy+r, 0xff,0x55,0x55, 16);
      drawLine(data, W, cx-r+8, cy-r+8, cx+r-8, cy+r-8, 0xff,0x99,0x99, 5);
      drawLine(data, W, cx+r-8, cy-r+8, cx-r+8, cy+r-8, 0xff,0x99,0x99, 5);
    } else if (val === "O") {
      // Cyan O — thick ring with inner glow
      drawCircleRing(data, W, cx, cy, 72, 14, 0x4f,0xc3,0xf7);
      drawCircleRing(data, W, cx, cy, 57, 4,  0xaa,0xe8,0xff);
    } else if (font64) {
      // Muted number 1-9
      try {
        await img.print({ font: font64, x: cx - 18, y: cy - 32, text: String(i+1) });
        // Tint to muted blue-gray
        const tx = cx-18, ty = cy-32;
        for (let dy = -2; dy < 36; dy++) {
          for (let dx = -2; dx < 40; dx++) {
            const idx = ((ty+dy)*W + (tx+dx)) * 4;
            if (idx < 0 || idx >= data.length) continue;
            if (data[idx+3] > 40) {
              data[idx]   = 0x50; data[idx+1] = 0x60; data[idx+2] = 0x90;
            }
          }
        }
      } catch (_) {}
    }
  }

  return img.getBuffer("image/png");
}

// ── Game helpers ─────────────────────────────────────────────────────────────

const WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function checkWin(cells, mark) {
  return WIN_LINES.some(([a,b,c]) => cells[a]===mark && cells[b]===mark && cells[c]===mark);
}

function isDraw(cells) { return cells.every(Boolean); }

function botPlay(cells, bot, opp) {
  // win
  for (let i = 0; i < 9; i++) {
    if (!cells[i]) { const t=[...cells]; t[i]=bot; if(checkWin(t,bot)) return i; }
  }
  // block
  for (let i = 0; i < 9; i++) {
    if (!cells[i]) { const t=[...cells]; t[i]=opp; if(checkWin(t,opp)) return i; }
  }
  if (!cells[4]) return 4;
  const corners = [0,2,6,8].filter(i => !cells[i]);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  const empty = cells.map((c,i)=>!c?i:-1).filter(i=>i>=0);
  return empty[Math.floor(Math.random() * empty.length)];
}

function fmt(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

// Active games
const games = new Map();

// ── Reply with image ──────────────────────────────────────────────────────────

async function replyBoard(message, cells, body, gameID, senderID) {
  let attachment;
  try {
    const buf  = await makeBoardImage(cells);
    const file = path.join(CACHE_DIR, `ttt-${Date.now()}.png`);
    fs.writeFileSync(file, buf);
    attachment = fs.createReadStream(file);
    attachment.on("close", () => { try { fs.unlinkSync(file); } catch (_) {} });
  } catch (_) {}

  const payload = attachment ? { body, attachment } : body;

  return message.reply(payload, (err, info) => {
    if (!info || !gameID) return;
    global.GoatBot.onReply.set(info.messageID, {
      commandName: "tictactoe",
      messageID: info.messageID,
      gameID,
      author: senderID
    });
  });
}

// ═════════════════════════════════════════════════════════════════════════════

module.exports = {
  config: {
    name: "tictactoe",
    aliases: ["ttt", "tic", "xo"],
    version: "4.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "🎮 Tic-Tac-Toe — Image Board সহ!",
    longDescription: "Tic-Tac-Toe vs Bot or Player with bet. সুন্দর image board দেখাবে।",
    category: "game",
    guide: {
      en:
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
        "🎮 TIC-TAC-TOE — কীভাবে খেলবে\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
        "🤖 AI আগে (default):\n" +
        "   {pn}           → default bet\n" +
        "   {pn} 50000     → bet দিয়ে\n\n" +
        "✅ তুমি আগে:\n" +
        "   {pn} f         → board দেখে চাল দাও\n" +
        "   {pn} f 9       → ৯ নম্বরে সাথে সাথে\n" +
        "   {pn} f 9 50000 → bet সহ ৯ তে\n\n" +
        "👥 দুজনে:\n" +
        "   {pn} @mention  → challenge\n\n" +
        "📌 Reply তে শুধু 1-9 দিলেই চাল পড়বে।\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    }
  },

  onStart: async function ({ message, event, usersData, args }) {
    const { senderID, mentions } = event;

    // Arg parsing
    const userFirst = ["f","first"].includes((args[0]||"").toLowerCase());
    let initialCell = null, bet = 10000;

    for (const a of args) {
      if (["f","first"].includes(a.toLowerCase()) || a.startsWith("@")) continue;
      const n = parseInt(a.replace(/,/g,""));
      if (isNaN(n)) continue;
      if (n >= 1 && n <= 9) initialCell = n - 1;
      else if (n >= 1000)   bet = n;
    }

    if (bet < 1000)         return message.reply("❌ Minimum bet: ৳1,000");
    if (bet > 100_000_000)  return message.reply("❌ Maximum bet: ৳100M");

    const senderData  = await usersData.get(senderID);
    const senderMoney = senderData?.money ?? 0;
    if (senderMoney < bet)
      return message.reply(
        `❌ যথেষ্ট balance নেই!\nBalance: ৳${fmt(senderMoney)} | Bet: ৳${fmt(bet)}`
      );

    const mentionKeys = Object.keys(mentions || {});
    const vsBot       = mentionKeys.length === 0;
    const opponent    = vsBot ? null : mentionKeys[0];

    if (opponent === senderID) return message.reply("❌ নিজের বিরুদ্ধে খেলা যাবে না!");

    if (!vsBot) {
      const oppMoney = (await usersData.get(opponent))?.money ?? 0;
      if (oppMoney < bet)
        return message.reply(`❌ প্রতিপক্ষের balance কম! (৳${fmt(oppMoney)})`);
    }

    const cells      = Array(9).fill("");
    const gameID     = `${senderID}_${Date.now()}`;
    const playerMark = userFirst ? "X" : "O";
    const botMark    = userFirst ? "O" : "X";

    games.set(gameID, {
      cells, senderID, opponentID: opponent,
      vsBot, bet, playerMark, botMark,
      currentTurn: "X", started: Date.now()
    });
    const game = games.get(gameID);

    const pName = senderData?.name || "Player";
    let note = "";

    // First move logic
    if (vsBot && !userFirst) {
      const bp = botPlay(game.cells, botMark, playerMark);
      game.cells[bp] = botMark;
      game.currentTurn = playerMark;
      note = `🤖 Bot আগে চাল দিয়েছে!\n⭕ তোমার পালা → reply তে 1-9 দাও`;
    } else if (vsBot && userFirst && initialCell !== null) {
      game.cells[initialCell] = playerMark;
      if (checkWin(game.cells, playerMark)) {
        games.delete(gameID);
        await usersData.addMoney(senderID, bet);
        return replyBoard(message, game.cells,
          `🎉 তুমি জিতেছ! ৳${fmt(bet)} পেয়েছ!`, null, null);
      }
      const bp = botPlay(game.cells, botMark, playerMark);
      game.cells[bp] = botMark;
      if (checkWin(game.cells, botMark)) {
        games.delete(gameID);
        await usersData.subtractMoney(senderID, bet);
        return replyBoard(message, game.cells,
          `😈 Bot জিতেছে! ৳${fmt(bet)} হেরেছ!`, null, null);
      }
      if (isDraw(game.cells)) {
        games.delete(gameID);
        return replyBoard(message, game.cells, `🤝 Draw!`, null, null);
      }
      game.currentTurn = playerMark;
      note = `✅ তুমি ${initialCell+1}-এ দিলে, Bot জবাব দিয়েছে!\n❌ তোমার পালা → 1-9 দাও`;
    } else {
      note = userFirst
        ? `✅ তুমি আগে! ❌ → reply তে 1-9 দাও`
        : `🤖 Bot আগে চাল দেবে... তোমার পালা ⭕`;
    }

    const xLabel = !userFirst ? "❌ Bot"        : `❌ ${pName}`;
    const oLabel =  userFirst ? "⭕ Bot"         : `⭕ ${pName}`;
    const header = `${xLabel} vs ${oLabel} | 💰 ৳${fmt(bet)}\n${note}`;

    return replyBoard(message, game.cells, header, gameID, senderID);
  },

  onReply: async function ({ message, event, usersData }) {
    const { senderID, body } = event;
    const gameID = (event.replyData || message.replyData || {}).gameID;
    if (!gameID) return;

    const game = games.get(gameID);
    if (!game) return message.reply("❌ Game শেষ হয়ে গেছে।");
    if (Date.now() - game.started > 5 * 60 * 1000) {
      games.delete(gameID);
      return message.reply("⏰ 5 মিনিট পার! Game বাতিল।");
    }

    const { playerMark, botMark, senderID: p1, opponentID: p2 } = game;

    // Turn check
    if (game.vsBot) {
      if (senderID !== p1 || game.currentTurn !== playerMark) return;
    } else {
      const isP1 = senderID === p1, isP2 = senderID === p2;
      if (!isP1 && !isP2) return;
      if (game.currentTurn === playerMark  && !isP1) return;
      if (game.currentTurn !== playerMark  && !isP2) return;
    }

    const pos = parseInt(body.trim()) - 1;
    if (isNaN(pos) || pos < 0 || pos > 8)
      return message.reply("❌ 1-9 এর মধ্যে একটি সংখ্যা দাও।");
    if (game.cells[pos])
      return message.reply("❌ এই cell ভরা! অন্য cell বেছে নাও।");

    game.cells[pos] = game.currentTurn;

    if (checkWin(game.cells, game.currentTurn)) {
      const winID = game.vsBot ? p1 : senderID;
      const loseID = game.vsBot ? null : (senderID === p1 ? p2 : p1);
      games.delete(gameID);
      const wd = await usersData.get(winID);
      await usersData.addMoney(winID, game.bet);
      if (loseID) await usersData.subtractMoney(loseID, game.bet);
      return replyBoard(message, game.cells,
        `🏆 ${wd?.name||"Player"} জিতেছ! ৳${fmt(game.bet)} পেয়েছ!`, null, null);
    }

    if (isDraw(game.cells)) {
      games.delete(gameID);
      return replyBoard(message, game.cells, `🤝 Draw! কোনো balance পরিবর্তন নেই।`, null, null);
    }

    game.currentTurn = game.currentTurn === "X" ? "O" : "X";

    // Bot's move
    if (game.vsBot && game.currentTurn === botMark) {
      const bp = botPlay(game.cells, botMark, playerMark);
      game.cells[bp] = botMark;
      if (checkWin(game.cells, botMark)) {
        games.delete(gameID);
        await usersData.subtractMoney(p1, game.bet);
        return replyBoard(message, game.cells,
          `😈 Bot জিতেছে! 💸 ৳${fmt(game.bet)} হেরেছ!`, null, null);
      }
      if (isDraw(game.cells)) {
        games.delete(gameID);
        return replyBoard(message, game.cells, `🤝 Draw! balance পরিবর্তন নেই।`, null, null);
      }
      game.currentTurn = playerMark;
    }

    const mark = game.currentTurn === "X" ? "❌" : "⭕";
    const whose = game.vsBot
      ? `${mark} তোমার পালা!`
      : `${mark} ${game.currentTurn === playerMark
          ? (await usersData.get(p1))?.name
          : (await usersData.get(p2))?.name || "Player"} এর পালা!`;

    return replyBoard(message, game.cells,
      `${whose} → reply তে 1-9 দাও`, gameID, senderID);
  }
};
