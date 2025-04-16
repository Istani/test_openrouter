var debug = require("@istani/debug")(require('./package.json').name);

var envpath = __dirname + '/.env';
var config = require('dotenv').config({ path: envpath });

const OpenAI = require('openai');
const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.API_KEY,
  /*
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  },
  */
});

async function main() {
  const completion = await openrouter.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
  });
  if (typeof completion.error != "undefined") {
    debug.error(completion.error.message);
    process.exit();
    return;
  }
  console.log(completion.choices[0].message);
}
main();