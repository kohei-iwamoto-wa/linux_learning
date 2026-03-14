## 目的

Linux学習環境を毎回手動で構築するのが手間だったため、
AWS CDKを用いて再現可能な環境をIaC化しました。

これにより

・環境構築の手作業を削減
・数分で学習環境を構築可能
・他のエンジニアも同じ環境を利用可能

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