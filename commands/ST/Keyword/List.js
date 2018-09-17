// Own functions
const MsgFormat = require('../../../functions/MsgFormat.js');
const DataBase = require('../../../functions/DataBase.js');
const Pastebin = require('../../../functions/Pastebin.js');
const Authorize = require('../../../functions/Authorize.js');

module.exports = {
    description: '列出目前有的關鍵字回應，參數：-My 顯示自己的回應清單、-Here 顯示此群組內創建的清單、-Public 顯示公共回應清單，-All 顯示全部。',
    MessageHandler: function (event) {
        return new Promise(async function (resolve, reject) {
            var param = [], all = false;
            if (/-My/.test(event.message.text)) param[param.length] = 'author="' + event.source.userId + '"';
            if (/-Here/.test(event.message.text)) param[param.length] = 'place="' + event.source[event.source.type + 'Id'] + '"';
            if (/-Public/.test(event.message.text)) param[param.length] = 'place="Public"';
            if (/-All/.test(event.message.text)) {
                if (!(await Authorize.Owner(event.source.userId))) all = true;
                else {
                    reject('您沒有權限讀取全部關鍵字回應！');
                    return 0;
                }
            }

            if (param.length == 0) reject('缺少參數，參數：-My 顯示自己的回應清單、-Here 顯示此群組內創建的清單、-Public 顯示公共回應清單，-All 顯示全部。');

            DataBase.all('SELECT * FROM Keyword' + (!all ? ' WHERE ' + param.join(' AND ') : '')).then(keyword => {
                Pastebin.post(keyword.map(value => "{\n\tid: " + value.id + ",\n\tauthor: " + value.author + ",\n\tplace: " + value.place + ",\n\tmethod: " + value.method + ",\n\tkeyword: " + decodeURIComponent(value.keyword) + ",\n\tdataType: " + value.dataType + ",\n\tdata: " + decodeURIComponent(value.data) + "\n}").join('\n'), false, 1, "10M", "SunTai Keyword Response List (" + (new Date()).toLocaleString("zh-tw", { hour12: false }) + ")").then(url => resolve(MsgFormat.Text('關鍵字回應詳細清單如下：' + url)), reject)
            }, reject);
        });
    }
};