import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from './constructs/vpc/vpc';
import { Ec2  } from './constructs/compute/ec2';

export class LinuxLearningStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'LinuxLearningVPC', {});

    const bastion = new Ec2(this, 'Ec2Instance', {
        targetVpc: vpc.vpc,
    });
  }
}