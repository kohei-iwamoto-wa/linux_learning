## 1. 目的

Linux学習環境を毎回手動で構築するのが手間だったため、
AWS CDKを用いて再現可能な環境をIaC化しました。

これにより

・環境構築の手作業を削減
・数分で学習環境を構築可能
・他のエンジニアも同じ環境を利用可能

## 2. 前提条件

* 以下をインストール済みであること
  * [AWS CLI](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html)
  * [Session Manager plugin](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)
  * [AWS CDK CLI](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/getting-started.html)

## 3. 利用手順

### 3.1. リポジトリのクローン

```
git clone https://github.com/kohei-iwamoto-wa/linux_learning.git
cd linux_learning
```

### 3.2. 依存関係のインストール

```
npm install
```

### 3.3. CDK bootstrap

CDKを初めて使用するAWSアカウント / リージョンでは
以下のコマンドを実行してCDKの初期リソースを作成します。

```
cdk bootstrap
```

このコマンドにより、以下のリソースが作成されます。

- CDK用S3バケット
- CDK用IAMロール
- CDKデプロイ用リソース

この作業は アカウントごとに一度だけ必要です。

### 3.4. TypeScriptをビルド

```
cdk run build
```

### 3.5. CDKスタックをデプロイ

```
cdk deploy
```

### 3.6. EC2へ接続

#### 3.6.1. EC2 インスタンスのインスタンスIDを確認

```
aws ec2 describe-instances
```

#### 3.6.2. Session Managerで接続

```
aws ssm start-session --target i-0077eb639ba9ea7db --region us-west-2
Starting session with SessionId: dev_kohei_iwamoto-slacaqeuebzhjyk9bdq579b8ra
```

#### 3.6.3.  EC2 に接続済みか確認

```
sh-4.2$ hostname
ip-10-0-0-124.us-west-2.compute.internal
```

### 4. 学習環境削除

```
cdk destroy <スタック名>
```

### 5. 補足

このプロジェクトでは、EventBridge Scheduler を使用して
CloudFormationスタックを定期的に削除する仕組みも用意しています。

デフォルトの設定では*日本時間午前1時にスタックごと削除*されます。

これにより、*学習環境の削除忘れによるAWSコスト発生*を防ぐことができます。 

削除されたくな場合は、`EventBridge Scheduler` のスケジュールをオフにしてください。