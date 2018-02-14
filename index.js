"use strict";
const Alexa = require('alexa-sdk');


// 占い結果の定義
const fortunes = [
    {'score':'good','description':'星みっつで良いでしょう' },
    {'score':'normal', 'description':'星ふたつで普通でしょう' },
    {'score':'bad','description':'星ひとつでイマイチでしょう' }
];


//requestをrequire
//var request = require('request');
var request = require('sync-request');

//ヘッダーを定義
var headers = {
  'Content-Type':'application/json'
}


// Lambda関数のメイン処理
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context); // Alexa SDKのインスタンス生成
    //alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers); // ハンドラの登録
    alexa.execute();                  // インスタンスの実行
};


function httpGet(url){
  var response = request(
    'GET',
    url
    );
    console.log("responseを受け取りました");
    return response.body;
}

var handlers = {
    // インテントに紐付かないリクエスト
    'LaunchRequest': function () {
    this.emit('AMAZON.HelpIntent'); // AMAZON.HelpIntentの呼び出し
    },
    // スキルの使い方を尋ねるインテント
    'AMAZON.HelpIntent': function () {
        this.emit(':tell', '今日の運勢を占います。' +
            'たとえば、うらないでふたご座の運勢を教えてと聞いてください');
    },
    // 対話モデルで定義した、占いを実行するインテント
    'HoroscopeIntent': function () {
        var sign = this.event.request.intent.slots.StarSign.value; // スロットStarSignを参照
        var fortune = fortunes[Math.floor(Math.random()*3)];       // ランダムに占い結果を取得
        var message = '今日の' + sign + 'の運勢は' + fortune.description; // 応答メッセージ文字列の作成

/*
      var options = {
      uri: "https://rti-giken.jp/fhc/api/train_tetsudo/delay.json",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      form: {
        "chatroom_id": roomId,
        "content": message,
        "user_id": userId
      }
    };
    request.get(options, function(error, response, body){
        //message = response;
      var resJson = JSON.parse(body);
      var company = resJson[0]["company"];
      var message2 = "電車が遅延しています" + company;
      this.emit(':tell', message2);
      console.log("message2");
      console.log(message2);

      console.log("response");
      console.log(response);
    });
    */

    var response = httpGet('https://public.bitbank.cc/btc_jpy/ticker');
    console.log("APIリクエスト終了です ");

    var resJson = JSON.parse(response);
    var price = resJson["data"]["last"];
    var message2 = "現在の" + sign + "の価格は" + price + "円です。";
    this.emit(':tell', message2);
    console.log("終了です");

    }
};