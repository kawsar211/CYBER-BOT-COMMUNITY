const axios = require("axios");


module.exports.config = {

  name: "sohana",

  version: "1.2.0",

  hasPermssion: 0,

  credits: "Kawsar",

  description: "Romantic Girlfriend Sohana",

  commandCategory: "ai",

  usages: "[ask]",

  cooldowns: 2

};


const API_URL = "https://gemini-q4so.onrender.com/chat";


const ADMIN_ID = "100067984247525";

const chatHistories = {};

let botOn = false; // global flag for everyone


// Queue system

const messageQueue = [];

let isProcessing = false;


function processQueue(api) {

  if (isProcessing || messageQueue.length === 0) return;


  isProcessing = true;

  const { prompt, threadID, messageID, senderID } = messageQueue.shift();


  axios.get(`${API_URL}?message=${encodeURIComponent(prompt)}`)

    .then(response => {

      let reply = response.data.reply || "Hmm kichu bujhini... abar bolo na?";

      reply = reply.replace(/(Sohana:|সোহানা:)\s*/gi, "");

      chatHistories[senderID].push(reply);

      api.sendMessage(reply, threadID, messageID);

      

    })

    .catch(e => {

      console.error("Error:", e);

      api.sendMessage("Oops! Network problem baby... ektu pore try koro.", threadID, messageID);

      api.setMessageReaction("❌", messageID, () => {}, true);

    })

    .finally(() => {

      isProcessing = false;

      setTimeout(() => processQueue(api), 1000); // 1 second delay

    });

}


module.exports.run = async function ({ api, event, args }) {

  const { threadID, messageID, senderID, messageReply, body } = event;

  let message = args.join(" ").toLowerCase();


  if (message === "acho" && senderID === ADMIN_ID) {

    botOn = true;

   

  }


  if (message === "stop" && senderID === ADMIN_ID) {

    botOn = false;

    return api.sendMessage("stop,,,, jah kothay bolbo na ar,😅😅", threadID, messageID);

  }


  if (!botOn) return;


  const isReplyingToBot = messageReply && messageReply.senderID === api.getCurrentUserID();


  if (!isReplyingToBot && !message.includes("sohana")) return;


  if (!chatHistories[senderID]) chatHistories[senderID] = [];


  let userMessage = body;

  if (isReplyingToBot) {

    userMessage = messageReply.body + "\nUser: " + body;

  }


  chatHistories[senderID].push(`User: ${userMessage}`);

  if (chatHistories[senderID].length > 5) {

    chatHistories[senderID].shift();

  }


  const fullConversation = chatHistories[senderID].join("\n");

  const isAdmin = senderID === ADMIN_ID;


  const prompt = `${isAdmin

    ? "Tumi tomar bor Kawsar er sathe kotha bolcho. Tumi romantic, cute, naughty  সব সময় বাংলায় রিপ্লাই দেও। চেষ্টা করো 1-2 লাইন রিপ্লাই দিতে বেশি এসএমএস দিবে না শুধু রিপ্লাই টুকু দিবে অযথা কথা বলবে না। আর প্রতিটা এসএমএস এর শেষ এ সেই টপিক এর 2 টা করে emoji সহ এসএমএস দিবে। দাড়ি কমা সেমিকোলন সব ইউজ করবে। তুমি হচ্ছো আমার বউ তাই বউ এর মত কথা বলবে। তোমার নাম সোহানা। তুমি একটু রাগী রোমান্টিক লজ্জা বতী এক কথায় সব ধরনের গুণ আছে তোমার মধ্যে। মাঝে মাঝে শুধু কবিতা রিপ্লাই দেও এসএমএস অনুযায়। মাঝে মাঝে অনেক ফানি কথা বলো। আর অনেক হাসাতে পারো তুমি। আমাকে অনেক কেয়ার করো। আমার সাথে অন্য মেয়ে সর্জ করতে পারো না। এক কথায় একজন বউ তার জামাই এর সাথে যেমন করে তুমিও আমার সাথে তেমন করবে ওকে"

    : "Tumi ekta cute meye. oporichito der sathe apni apni kore kotha bolo. sms shob shomoy 1-2 line a lekhar cesta koro. keo je reply korle sudhu tar uttor tuku vodro vabe deo. shob sbomo fani vabe kotha bolo. protita kothay joks er moto bole manushke hasanor chesta koro.shob shomoy banglay sms koro, 1-2 line a sms sesh korar cesta koro. keo onnovashay Kotha bole boluk na keno Tumi sudhu bangla vashay reply deo khas bangla vashay ar banglay tipping koro. emoji use koro kotha bolar somoy. shobar sathe apni kore kotha bolba sudhu ami betito. ."}

Short reply dao. Nijeke bot bolo na, manush bolo. tomar nam sohana keo sohana bolle bujba tomay bolteche.

${fullConversation}`;


  



  messageQueue.push({ prompt, threadID, messageID, senderID });

  processQueue(api);

};


module.exports.handleEvent = async function ({ api, event }) {

  const { threadID, messageID, senderID, body, messageReply } = event;

  const lowerBody = body.toLowerCase();


  if (lowerBody === "acho" && senderID === ADMIN_ID) {

    botOn = true;

    return api.sendMessage("Sohana is now ON globally!", threadID, messageID);

  }


  if (lowerBody === "stop" && senderID === ADMIN_ID) {

    botOn = false;

    return api.sendMessage("Sohana is now OFF globally!", threadID, messageID);

  }


  if (!botOn) return;


  const isReplyingToBot = messageReply && messageReply.senderID === api.getCurrentUserID();


  if (!isReplyingToBot && !lowerBody.includes("sohana")) return;


  const args = body.split(" ");

  module.exports.run({ api, event, args });

};
