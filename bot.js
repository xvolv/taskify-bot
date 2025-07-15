// bot.js
const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();


// === CONFIG ===
const BOT_TOKEN = process.env.TOKEN; // <- Replace this with your real bot token
const bot = new Telegraf(BOT_TOKEN);

// === IN-MEMORY STATE ===
const userTasks = {}; // { userId: [{ text, durationMs, done }] }
const motivationalQuotes = [
  '[born to build]',
  '[what can you change is up to you]',
  '[sleep like fatties?]',
  '[mwahahah]'
];

let runningTimers = {}; // { userId: currentTaskIndex }

// === UTILS ===
function parseTaskInput(input) {
  const match = input.match(/^(.*)\s*-\s*(\d+)(hr|min|sec)$/i);
  if (!match) return null;

  const text = match[1].trim();
  const amount = parseInt(match[2]);
  const unit = match[3].toLowerCase();

  let durationMs = 0;
  if (unit === 'hr') durationMs = amount * 60 * 60 * 1000;
  else if (unit === 'min') durationMs = amount * 60 * 1000;
  else if (unit === 'sec') durationMs = amount * 1000;

  return { text, durationMs };
}

function formatTaskList(tasks) {
  if (!tasks || tasks.length === 0) return '```[no tasks yet]```';
  let output = '';

  const maxIndexLength = (tasks.length + 1).toString().length; // add +1 for leading dummy row
  const maxTextLength = Math.max(...tasks.map(task => task.text.length));

  output += `[00] [well we both know what you just did sal] [00]
`; // dummy header row

  tasks.forEach((task, i) => {
    const status = task.done ? '[x]' : '[ ]';
    const time = formatDuration(task.durationMs);
    const index = (i + 1).toString().padStart(2, '0');
    const text = task.text.padEnd(maxTextLength, ' ');
    output += `[${index}] [${text}] [${time}]
`;
  });

  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  output += `
[${quote}]`;
  return '```' + output + '```';
}

function formatDuration(ms) {
  if (ms >= 3600000) return Math.round(ms / 3600000) + 'hr';
  if (ms >= 60000) return Math.round(ms / 60000) + 'min';
  return Math.round(ms / 1000) + 'sec';
}

function getControlButtons() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('[add task]', 'ADD_TASK'),
      Markup.button.callback('[start]', 'START_SESSION')
    ],
    [
      Markup.button.callback('[update]', 'UPDATE_TASKS'),
      Markup.button.callback('[del-all]', 'DELETE_ALL')
    ],
    [
      Markup.button.callback('[show tasks]', 'SHOW_TASKS')
    ]
  ]);
}

// === BOT HANDLERS ===
bot.start((ctx) => {
  ctx.reply('[welcome back, human]\n[paste your tasks using format like]\n[task - 2hr]', getControlButtons());
});

bot.on('text', (ctx) => {
  const userId = ctx.from.id;
  const input = ctx.message.text;
  const parsed = parseTaskInput(input);

  if (!parsed) {
    ctx.reply('[syntax error] [task not added]\n[format: task - 2hr / 30min / 45sec]');
    return;
  }

  if (!userTasks[userId]) userTasks[userId] = [];
  userTasks[userId].push({ text: parsed.text, durationMs: parsed.durationMs, done: false });
  ctx.reply('[task added]');
});

bot.action('ADD_TASK', (ctx) => {
  ctx.reply('[send task like this]\n[read docs - 2hr]');
});

bot.action('DELETE_ALL', (ctx) => {
  const userId = ctx.from.id;
  userTasks[userId] = [];
  ctx.editMessageText('[all tasks deleted]', getControlButtons());
});

bot.action('UPDATE_TASKS', (ctx) => {
  ctx.reply('[update feature coming soon]');
});

bot.action('SHOW_TASKS', (ctx) => {
  const userId = ctx.from.id;
  const tasks = userTasks[userId] || [];
  ctx.reply(formatTaskList(tasks), { parse_mode: 'MarkdownV2' });
});

bot.action('START_SESSION', async (ctx) => {
  const userId = ctx.from.id;
  const tasks = userTasks[userId] || [];
  if (tasks.length === 0) {
    ctx.reply('[no tasks to run] [add some first]');
    return;
  }

  runningTimers[userId] = 0;
  ctx.reply('[starting session] [one at a time]');
  await runNextTask(ctx, userId);
});

async function runNextTask(ctx, userId) {
  const tasks = userTasks[userId];
  const index = runningTimers[userId];
  if (!tasks || index >= tasks.length) {
    ctx.reply('[session complete] [all tasks done]');
    return;
  }

  const task = tasks[index];
  ctx.reply(`[executing task ${index + 1}] [${task.text}] [${formatDuration(task.durationMs)}]`);

  setTimeout(() => {
    tasks[index].done = true;
    const nextIndex = index + 1;
    if (nextIndex < tasks.length) {
      ctx.reply(`[task ${index + 1} completed] [just switch]\n[next up: task ${nextIndex + 1}]`);
      runningTimers[userId] = nextIndex;
      runNextTask(ctx, userId);
    } else {
      ctx.reply('[all tasks done] [rest or reload]');
    }
  }, task.durationMs);
}

bot.command('tasks', (ctx) => {
  const userId = ctx.from.id;
  const tasks = userTasks[userId];
  ctx.reply(formatTaskList(tasks), { parse_mode: 'MarkdownV2' });
});

// === RUN BOT ===
bot.launch();
console.log('[task CLI bot is live]');
