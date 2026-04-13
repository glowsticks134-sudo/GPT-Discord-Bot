# GPT Discord Bot

## Project Overview
- Node.js Discord bot using discord.js v14 and OpenAI.
- Main runtime entry point: `index.js`.
- Slash command registration entry point: `register.js`.
- Commands live in `commands/messages` and `commands/interactions`; Discord events live in `events`.

## Replit Setup
- Node.js 20 is configured in `.replit`.
- The main workflow runs `npm start`.
- This is a long-running bot, not a frontend website.
- Production deployment is configured as a VM process because Discord bots must stay connected.

## Configuration
- Runtime configuration is loaded through `utils/config.js`.
- Sensitive values should be stored as Replit secrets:
  - `DISCORD_BOT_TOKEN`
  - `OPENAI_API_KEY`
- Non-secret optional values:
  - `DISCORD_CLIENT_ID` for slash command registration
  - `BOT_PREFIX`
  - `BOT_MAIN_COLOR`
  - `BOT_ERROR_COLOR`
- If `DISCORD_BOT_TOKEN` is missing, the bot stays alive and logs configuration instructions instead of crashing.

## Commands
- Start bot: `npm start`
- Register slash commands after adding token/client ID: `node register.js`