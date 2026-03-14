## 目的

Linux 学習環境を AWS に cdk コマンドで構築する

## メリット

コマンド１つで AWS リソースのデプロイと削除を行うことができ、学習ごとの構築やコストが最小限に抑えられる。

## コマンドの使い方

`cdk.json` があるディレクトリで以下のコマンドを実行する。

* `npm run build`   TypeScriptをjavaScriptにコンパイルする。
* `npx cdk deploy`  スタックをデプロイする。
* `npx cdk diff`    現行と変更時の差分を確認する。
* `npx cdk synth`   cdk から生成されるCloudForamtion テンプレートを確認する。

## ローカルからSSHする方法

### インスタンスIDを指定して接続

```
aws ssm start-session --target {インスタンスID}
```

### ローカルの8080ポートをEC2の80ポートに転送

```
aws ssm start-session --target <インスタンスID> \
   --document-name AWS-StartPortForwardingSession \
   --parameters '{"portNumber":["80"],"localPortNumber":["8080"]}'
```