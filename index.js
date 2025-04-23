var debug = require("@istani/debug")(require('./package.json').name);

var envpath = __dirname + '/.env';
var config = require('dotenv').config({ path: envpath });

var path = require('path');

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

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

// Funktion zum starten der text generation
async function TextGeneration(prompt, callback) {
  try {
    const completion = await openrouter.chat.completions.create({
      model: 'mistralai/mistral-small-3.1-24b-instruct:free',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    if (typeof completion.error != "undefined") {
      throw(completion.error.message);
    }
    callback(completion.choices[0].message.content/*.replaceAll("\n","")*/);
  }
  catch (E) {
    debug.error(JSON.stringify(E));
    //await sleep(30*1000);
    //TextGeneration(prompt, callback)
  }
}
// Funktion zum starten der image generation
async function ImageGeneration(prompt, callback) {
  debug.error("AI Without Image Generation!");
  callback("");
}

exports.ImageGeneration = ImageGeneration;
exports.TextGeneration = TextGeneration;

// Andere Funktionen, die nichts mit der AI Funktion zu tun haben
async function GetModels() {
  const fs = require("fs");

  const response = await fetch("https://openrouter.ai/api/v1/models");
  const data = await response.json();
  fs.writeFileSync(path.join(__dirname, "temp/models.json"), JSON.stringify(data.data,null,2));

  var free = [];
  for (var i = 0; i < data.data.length; i++) {
    var model = data.data[i];
    if (model.pricing.prompt!='0') continue;
    if (model.pricing.completion!='0') continue;
    if (model.pricing.request!='0') continue;
    if (model.pricing.image!='0') continue;
    if (model.pricing.web_search!='0') continue;
    if (model.pricing.internal_reasoning!='0') continue;
    free.push(model);
  }
  fs.writeFileSync(path.join(__dirname, "temp/models_free.json"), JSON.stringify(free,null,2));
}
GetModels();
