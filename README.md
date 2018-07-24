# 日太 suntai
A project of chatbot which use Developer Trial plan.

## 特點
* 自動讀取指令，只需對資料夾新增資料即可

## 注意事項
* 需要一個 config.json 檔案，在第一次執行後會自動在跟目錄產生 config 資料夾，內含 config.json 檔案。config.json 檔案必須至少含有 line webhook 的 channelSecret 跟 channelAccessToken。
* Bot 用到 sqlite database，若沒有已經可以使用的 database (settings/settings.sqlite) 將無法正常運作。

### Database (settings/settings.sqlite) 內容

**Groups** -> 加入的群組
`CREATE TABLE 'Groups' (
    'id'	TEXT UNIQUE,
    PRIMARY KEY('id')
);`

**Rooms** -> 加入的聊天室
`CREATE TABLE 'Rooms' (
    'id'    TEXT UNIQUE,
    PRIMARY KEY('id')
);`

**Owners** -> 管理員
`CREATE TABLE 'Owners' (
    'id'	TEXT UNIQUE,
    PRIMARY KEY('id')
);`

**OwnersNotice** -> 會接收提醒的管理員
`CREATE TABLE 'OwnersNotice' (
    'id'	TEXT UNIQUE,
    PRIMARY KEY('id')
);`

**Variables** -> 變數
`CREATE TABLE 'Variables' (
    'id'    TEXT UNIQUE,
    'data'  TEXT,
    PRIMARY KEY('id')
);`