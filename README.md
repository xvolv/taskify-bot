# 🧠 [taskify-bot](https://t.me/taskvalutbot)


A nerdy Telegram task bot built for productivity minimalists. No flashy UI. Just `[text]`, `[time]`, and `[focus]`. Monospace layout, CLI-style vibes, and one-task-at-a-time workflow.

> "[born to build]"

---

## ✅ Features

- Add tasks like: `read docs - 2hr`
- Starts session and runs one task at a time
- Sends a reminder after each task is complete
- Shows task list in monospace `[index] [task] [duration]` format
- Sends a random motivational quote at the bottom
- Clean UI: all buttons grouped at bottom
- Nerd-style tone like a shell prompt

---

## 💻 Commands & Buttons

| Action           | Description                              |
|------------------|------------------------------------------|
| `[add task]`     | Add a new task via message input         |
| `[start]`        | Begin looping through tasks              |
| `[show tasks]`   | View all current tasks                   |
| `[del-all]`      | Delete all tasks                         |
| `[update]`       | (coming soon) edit tasks                 |
| `/tasks`         | Same as `[show tasks]`                   |

---

## 📥 Input Format

task description - 1hr / 30min / 45sec

makefile
Copy
Edit

Example:
read POS docs - 2hr
learn figma - 1hr
design UI - 30min



---

## 🛠 Local Setup

```bash
git clone https://github.com/xvolv/taskify-bot.git
cd taskify-bot
npm install
Create a .env file:

ini
Copy
Edit
TOKEN=your_bot_token
Then run:

bash
Copy
Edit
node bot.js
☁️ Deploy to Railway
Push this project to GitHub

Go to railway.app

Create New Project → Deploy from GitHub

Set environment variable in Railway:

ini
Copy
Edit
TOKEN = your_bot_token
Deploy and watch logs

🧠 Sample Output
css
Copy
Edit
[00] [well we both know what you do sal] [∞]
[01] [read pos docs               ] [3hr]
[02] [learn figma                 ] [1hr]
[03] [design the pos in figma    ] [30min]

[what can you change is up to you]
🧠 Author
Made by @sal_static
Inspired by Coding Sloth and Veraxity hacker aesthetics

[sleep like fatties?]

