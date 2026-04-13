const fileConfig = require('../configs/config.json');

const placeholderValues = new Set([
  "Put anything you want as bot's prefix.",
  "Put anything you want as a prefix",
  "Put a #HexCode for embeds' color.",
  "Put any #HexCode you want for embeds color",
  "Put any #HexCode you want for embeds color when there is an error",
  "Put a #HexCode for embeds that'll be sent when there is an error.",
  "Put your Bot's/Client's ID.",
  "Put your Bot ID/Client ID here",
  "Put your Bot's Token.",
  "Put your Bot Token here",
  "Put your Open AI's API Key.",
  "Put your Open AI API Key here"
]);

function valueFromEnv(key, fallback) {
  const value = process.env[key] || fallback;
  if (!value || placeholderValues.has(value)) return undefined;
  return value;
}

module.exports = {
  Prefix: valueFromEnv('BOT_PREFIX', fileConfig.Prefix) || '!',
  MainColor: valueFromEnv('BOT_MAIN_COLOR', fileConfig.MainColor) || '#5865F2',
  ErrorColor: valueFromEnv('BOT_ERROR_COLOR', fileConfig.ErrorColor) || '#ED4245',
  ClientID: valueFromEnv('DISCORD_CLIENT_ID', fileConfig.ClientID),
  Token: valueFromEnv('DISCORD_BOT_TOKEN', process.env.DISCORD_TOKEN || fileConfig.Token),
  OpenAIapiKey: valueFromEnv('OPENAI_API_KEY', fileConfig.OpenAIapiKey)
};