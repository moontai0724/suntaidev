const path = require("path");

// Own functions
const MsgFormat = require(path.join(process.cwd(), "functions", "MsgFormat.js"));
const CommandsList = require(path.join(process.cwd(), "functions", "CommandsList.js"));

module.exports = {
    description: '關鍵字回應功能。',
    MessageHandler: function (event) {
        return new Promise(async function (resolve, reject) {
            resolve(MsgFormat.Text(await CommandsList.getCommands(event.message.originalText.replace('/', '').split(' '), !/^all$/i.test(event.message.text.replace(/\s/, '')), event.data.parents)));
        });
    }
};