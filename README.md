# BruteForceCalling

## プロジェクトの概要

今すぐ連絡したい!!
でも電話してもなかなか繋がらない!!
そんなことにお困りの方に
BruteForceCallingに電話を番号を登録しておくと
相手が電話に出てくれるまで繰り返し電話をかけ続けてくれます。
そんなサービスです。
[BruteForceCalling](https://protopedia.net/prototype/801272ee79cfde7fa5960571fee36b9b)

## 技術的なお話

### Twilio


### firebase

#### 環境変数の設定

firebase functions:configを使用して環境変数を設定します。例えば以下のように設定します。

```sh
firebase functions:config:set someservice.key="THE API KEY" someservice.id="THE CLIENT ID"
```

登録されている環境変数の値をコマンドラインから確認するには

```sh
firebase functions:config:get
```

とすると確認できます。今回の場合、

```json
{
  "someservice": {
    "key":"THE API KEY",
    "id":"THE CLIENT ID"
  }
}
```

このように入力されているのが確認できます。
なお、大文字のkeyを登録することはできません。



【参考】
 * [環境の構成](https://firebase.google.com/docs/functions/config-env)