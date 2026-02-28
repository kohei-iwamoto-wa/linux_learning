## コマンドの使い方

`cdk.json` があるディレクトリで以下のコマンドを実行する。

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## ローカルからSSHする方法

# インスタンスIDを指定して接続

SSM接続する。

> aws ssm start-session --target {インスタンスID}

# ローカルの8080ポートをEC2の80ポートに転送
> aws ssm start-session --target <インスタンスID> \
>    --document-name AWS-StartPortForwardingSession \
>    --parameters '{"portNumber":["80"],"localPortNumber":["8080"]}'