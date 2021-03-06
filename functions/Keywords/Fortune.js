const path = require("path");

// Own functions
const MsgFormat = require(path.join(process.cwd(), "functions", "MsgFormat.js"));
const fortuneStick = require(path.join(process.cwd(), "functions", "FortuneStick.json"));
// Source: https://gist.github.com/d94bb0a9f37cfd362453

module.exports = {
    description: "隨機回應一個淺草一百籤的籤詩，但僅回應籤與兇吉。",
    regex: /運勢/,
    response: function (event) {
        return new Promise((resolve, reject) => {
            let rn = Math.floor(Math.random() * 100);
            resolve(MsgFormat.Text(`籤號：${fortuneStick[rn].id}　${fortuneStick[rn].type}！`));
        });
    }
};