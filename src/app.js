"use strict";

const { Telegraf, Markup } = require("telegraf");
const { v4: uuidv4 } = require("uuid");

const pino = require("pino");
const logger = pino(
  pino.destination({
    dest: `${process.env.LOG_DIR}/quiz.log`, // omit for stdout
    sync: false, // Asynchronous logging
  })
);

const config = require("./config");
const dataService = require("./dataService");
const utils = require("./utils");

const bot = new Telegraf(config.botToken);

//get username for group command handling
bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username;
  logger.info("started... ", botInfo.username);
});

bot.start((ctx) => {
  dataService.registerUser(ctx);
  return ctx.reply("Ciao :)\nUsa /quiz per indovinare il nome dell'asana.");
});

bot.command("quiz", async (ctx) => {
  const shortUid = uuidv4().substring(0, 8);

  const asana = dataService.getRandomAsana();

  const quiz = { uid: shortUid, userId: ctx.chat.id, asanaId: asana.asanaId };
  logger.info(quiz);

  const names = utils.listName(asana.name);

  // Crea la tastiera con le risposte
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(names[0], utils.nameKeyboard(asana.asanaId, names[0])),
      Markup.button.callback(names[1], utils.nameKeyboard(asana.asanaId, names[1])),
    ],
    [
      Markup.button.callback(names[2], utils.nameKeyboard(asana.asanaId, names[2])),
      Markup.button.callback(names[3], utils.nameKeyboard(asana.asanaId, names[3])),
    ],
  ]);

  await ctx.replyWithPhoto(asana.fileId);

  // Invia il messaggio con la tastiera
  await ctx.reply("asana:", {
    parse_mode: "html",
    reply_markup: keyboard.reply_markup,
  });
});

bot.on("callback_query", async (ctx) => {
  // Gestisci la risposta dell'utente
  const answer = ctx.callbackQuery.data;

  const id = utils.uidAsana(answer);
  const name = utils.nameAsana(answer);

  const asana = dataService.getAsana(id);

  if (name === asana.name) {
    await ctx.reply(`🥳 ${name} è giusto!`);
  } else {
    await ctx.reply(`🫤 ${name} non è corretto!`);
  }
});

bot.on("photo", async (ctx) => {
  if (ctx.chat.id == config.adminId) {
    // Ottieni l'ID file dell'immagine
    const shortUid = uuidv4().substring(0, 8);
    const fileId = ctx.message.photo[0].file_id;
    const caption = ctx.message.caption;

    // Salva l'ID file in un database o in un file
    dataService.registerAsana({ shortUid: shortUid, fileId: fileId, name: caption });

    // Invia un messaggio di conferma all'utente
    await ctx.reply(`asanaId: ${shortUid}\nfileId: ${fileId.substring(0, 8)}\nname: ${caption}`);
  } else {
    await ctx.reply(`La funzionalità è consentita solo all'ADMIN`);
  }
});

// bot.catch((e) => {
//   console.log("Unhandled Bot Error! ${e.message}");
// });

// execute not AWS Lambda
bot.launch();
