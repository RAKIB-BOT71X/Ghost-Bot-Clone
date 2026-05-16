const axios = require("axios");
const { PassThrough } = require("stream");

function fmtFull(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const games = new Map();

function makeBoard(cells) {
  const icons = cells.map((c, i) => c === "X" ? "❌" : c === "O" ? "⭕" : `${i + 1}️⃣`);
  return (
    `${icons[0]}${icons[1]}${icons[2]}\n` +
    `${icons[3]}${icons[4]}${icons[5]}\n` +
    `${icons[6]}${icons[7]}${icons[8]}`
  );
}

function checkWin(cells, mark) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(([a,b,c]) => cells[a]===mark && cells[b]===mark && cells[c]===mark);
}

function isDraw(cells) {
  return cells.every(c => c === "X" || c === "O");
}

function botMove(cells) {
  const win = (cells, mark) => {
    const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(([a,b,c])=>cells[a]===mark&&cells[b]===mark&&cells[c]===mark);
  };
  for (let i = 0; i < 9; i++) {
    if (!cells[i] || cells[i]==="") {
      const t=[...cells]; t[i]="O";
      if (win(t,"O")) return i;
    }
  }
  for (let i = 0; i < 9; i++) {
    if (!cells[i] || cells[i]==="") {
      const t=[...cells]; t[i]="X";
      if (win(t,"X")) return i;
    }
  }
  if (!cells[4]||cells[4]==="") return 4;
  const corners=[0,2,6,8].filter(i=>!cells[i]||cells[i]==="");
  if(corners.length) return corners[Math.floor(Math.random()*corners.length)];
  const empty=cells.map((c,i)=>(!c||c==="")? i:-1).filter(i=>i>=0);
  return empty[Math.floor(Math.random()*empty.length)];
}

module.exports = {
  config: {
    name: "tictactoe",
    aliases: ["ttt", "tic", "xo"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "🎮 Tic-Tac-Toe game",
    longDescription: "Play Tic-Tac-Toe against the bot or another player! Bet coins and win big.",
    category: "game",
    guide: { en: "{pn} <bet> — Play vs Bot\n{pn} @mention <bet> — Play vs Player\nExample: .ttt 50000\nType 1-9 to place your mark." }
  },

  onStart: async function ({ message, event, usersData, args }) {
    const { senderID, mentions } = event;

    const betStr = args.find(a => !a.startsWith("@") && !isNaN(a.replace(/,/g,"")));
    const bet = betStr ? parseInt(betStr.replace(/,/g,"")) : 10000;

    if (bet < 1000) return message.reply("❌ Minimum bet: ৳1,000");
    if (bet > 100_000_000) return message.reply("❌ Maximum bet: ৳100M");

    const senderData = await usersData.get(senderID);
    const senderMoney = senderData?.money ?? 0;

    if (senderMoney < bet) {
      return message.reply(
        `❌ যথেষ্ট balance নেই!\n` +
        `আপনার Balance: ৳${fmtFull(senderMoney)}\n` +
        `Bet Amount: ৳${fmtFull(bet)}`
      );
    }

    const mentionKeys = Object.keys(mentions || {});
    const vsBot = mentionKeys.length === 0;
    let opponent = vsBot ? null : mentionKeys[0];

    if (opponent === senderID) return message.reply("❌ নিজের বিরুদ্ধে খেলা যাবে না!");

    if (!vsBot) {
      const oppData = await usersData.get(opponent);
      const oppMoney = oppData?.money ?? 0;
      if (oppMoney < bet) {
        return message.reply(`❌ ${oppData?.name || "তার"} কাছে যথেষ্ট balance নেই! (৳${fmtFull(oppMoney)})`);
      }
    }

    const cells = Array(9).fill("");
    const gameID = `${senderID}_${Date.now()}`;
    games.set(gameID, {
      cells,
      playerX: senderID,
      playerO: opponent,
      vsBot,
      bet,
      currentTurn: "X",
      started: Date.now()
    });

    const boardStr = makeBoard(cells);
    const opponentName = vsBot ? "🤖 Bot" : (await usersData.get(opponent))?.name || "Player 2";
    const playerName = senderData?.name || "Player 1";

    const msg =
      `🎮 𝗧𝗜𝗖-𝗧𝗔𝗖-𝗧𝗢𝗘 শুরু হয়েছে!\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `❌ ${playerName} vs ⭕ ${opponentName}\n` +
      `💰 Bet: ৳${fmtFull(bet)} each\n` +
      `🏆 Winner gets: ৳${fmtFull(bet * 2)}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      boardStr + `\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `❌ ${playerName} এর পালা!\n` +
      `1-9 লিখে reply করুন।\n` +
      `Game ID: ${gameID}`;

    return message.reply(msg, (err, info) => {
      if (!info) return;
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "tictactoe",
        messageID: info.messageID,
        gameID,
        author: senderID
      });
    });
  },

  onReply: async function ({ message, event, usersData }) {
    const { senderID, body } = event;
    const { gameID } = event.replyData || message.replyData || {};
    if (!gameID) return;

    const game = games.get(gameID);
    if (!game) return message.reply("❌ Game শেষ হয়ে গেছে।");

    const timeLimit = 5 * 60 * 1000;
    if (Date.now() - game.started > timeLimit) {
      games.delete(gameID);
      return message.reply("⏰ Time up! Game বাতিল হয়েছে।");
    }

    const isPlayerX = senderID === game.playerX;
    const isPlayerO = game.vsBot ? false : senderID === game.playerO;
    if (!isPlayerX && !isPlayerO) return;

    if (!game.vsBot) {
      if (game.currentTurn === "X" && !isPlayerX) return;
      if (game.currentTurn === "O" && !isPlayerO) return;
    } else {
      if (!isPlayerX) return;
    }

    const pos = parseInt(body.trim()) - 1;
    if (isNaN(pos) || pos < 0 || pos > 8) {
      return message.reply("❌ 1-9 এর মধ্যে একটি সংখ্যা দিন।");
    }
    if (game.cells[pos] === "X" || game.cells[pos] === "O") {
      return message.reply("❌ এই cell আগেই ভরা! অন্য cell বেছে নিন।");
    }

    game.cells[pos] = game.currentTurn;

    if (checkWin(game.cells, game.currentTurn)) {
      const winnerID = game.currentTurn === "X" ? game.playerX : game.playerO;
      const loserID  = game.currentTurn === "X" ? game.playerO : game.playerX;
      games.delete(gameID);

      const winnerData = await usersData.get(winnerID);
      const winnerName = winnerData?.name || "Winner";

      await usersData.addMoney(winnerID, game.bet);
      if (loserID) await usersData.subtractMoney(loserID, game.bet);

      const boardStr = makeBoard(game.cells);
      return message.reply(
        `🎉 𝗚𝗔𝗠𝗘 𝗢𝗩𝗘𝗥!\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        boardStr + `\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🏆 ${winnerName} জিতেছে!\n` +
        `💰 Prize: ৳${fmtFull(game.bet)}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━`
      );
    }

    if (isDraw(game.cells)) {
      games.delete(gameID);
      return message.reply(
        `🤝 𝗗𝗥𝗔𝗪!\n\n` +
        makeBoard(game.cells) + `\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💰 কোনো balance পরিবর্তন হয়নি।`
      );
    }

    game.currentTurn = game.currentTurn === "X" ? "O" : "X";

    if (game.vsBot && game.currentTurn === "O") {
      const botPos = botMove(game.cells);
      game.cells[botPos] = "O";

      if (checkWin(game.cells, "O")) {
        games.delete(gameID);
        await usersData.subtractMoney(game.playerX, game.bet);
        return message.reply(
          `😈 𝗕𝗢𝗧 𝗝𝗜𝗧𝗘𝗖𝗛𝗘!\n\n` +
          makeBoard(game.cells) + `\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━━\n` +
          `💸 আপনি ৳${fmtFull(game.bet)} হেরেছেন!`
        );
      }

      if (isDraw(game.cells)) {
        games.delete(gameID);
        return message.reply(
          `🤝 𝗗𝗥𝗔𝗪!\n\n` +
          makeBoard(game.cells) + `\n\n` +
          `💰 কোনো balance পরিবর্তন হয়নি।`
        );
      }

      game.currentTurn = "X";
    }

    const playerXData = await usersData.get(game.playerX);
    const nextName = game.currentTurn === "X"
      ? (playerXData?.name || "Player X")
      : (game.vsBot ? "Bot" : (await usersData.get(game.playerO))?.name || "Player O");

    return message.reply(
      makeBoard(game.cells) + `\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `${game.currentTurn === "X" ? "❌" : "⭕"} ${nextName} এর পালা!\n` +
      `1-9 লিখে reply করুন।`,
      (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "tictactoe",
          messageID: info.messageID,
          gameID,
          author: senderID
        });
      }
    );
  }
};
