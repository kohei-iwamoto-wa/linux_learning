import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from './constructs/vpc/vpc';
import { Ec2  } from './constructs/compute/ec2';
import { StackCleanup } from './constructs/eventbridge/eventbridge';

export class LinuxLearningStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'LinuxLearningVPC', {});

    const ec2 = new Ec2(this, 'Ec2Instance', {
        targetVpc: vpc.vpc,
    });

    new StackCleanup(this, 'DailyCleanup', {
      // 午前１時に毎日スタックを削除するスケジュールを設定
      schedule: cdk.aws_events.Schedule.cron({ hour: '1', minute: '0' }),
      // targetStackName を指定しない場合、このコードが書かれているスタック自体が消えます
  });
  }
}