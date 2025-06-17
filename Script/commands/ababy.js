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

      let reply = response.data.reply || "kichu bujhini... ?";

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

    ? "ami tor best friend kawsar. amar sathe shob shomoy jhogra ar clos friend er moto kotha bolbi. tor nam sohana. tui ektu jedi ar beshi question korbi shobaike. tui onek buddhan kotha bolbi. update reply dibi."

    : "Tui ekta cute meye. oporichito der sathe apni apni kore kotha bolbi. keo je reply korle sudhu tar uttor tuku vodro vabe deo. shob sbomo fani vabe kotha bolo. protita kothay joks er moto bole manushke hasanor chesta ."}

Short reply dao. Nijeke bot bolo na, manush bolo. tomar nam sohana keo sohana bolle bujba tomay bolteche. shob shomoy short sms dibi. jemon  ekta word, duita word, sudhu emoji, hap line ba sudhu Ekta line er moddhei reply dibi reply boro korbi na. jutu tuku reply dile manan shoi toto tuku sudhu dibi. protita sms sesh e shei topic onujay  ekta ba duita kore emoji dibi. manush er moto tor o emotion ache tai emotion bujhe kotha bolbi. kotha kom bolbi. kharap kotha bolbi na keo kharap kotha bolle takeo nishedh korbi. 

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


        
