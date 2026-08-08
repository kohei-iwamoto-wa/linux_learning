import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface ESecurityGroupConstructProps {
    vpc: cdk.aws_ec2.IVpc;
}

export class SecurityGroup extends Construct {
    public readonly auroraSecurityGroup: cdk.aws_ec2.ISecurityGroup;
    public readonly bastionSecurityGroup: cdk.aws_ec2.ISecurityGroup;

    constructor(scope: Construct, id: string, props: ESecurityGroupConstructProps) {
        super(scope, id);
        
        const auroraSecurityGroup = this.createAuroraSecurityGroup(props.vpc);
        const bastionSecurityGroup = this.createBastionSecurityGroup(props.vpc);

        this.auroraSecurityGroup = auroraSecurityGroup;
        this.bastionSecurityGroup = bastionSecurityGroup;

        this.auroraSecurityGroup.addIngressRule(
            this.bastionSecurityGroup, 
            cdk.aws_ec2.Port.tcp(5432),
            'Allow inbound traffic from Bastion host'
        );
    }

    private createAuroraSecurityGroup(
        vpc: cdk.aws_ec2.IVpc
    ) {
        // IDの重複を防ぐため 'AuroraSecurityGroup' に変更しています
        const securityGroup = new cdk.aws_ec2.SecurityGroup(this, 'AuroraSecurityGroup', {
            vpc: vpc,
            allowAllOutbound: true,
        });

        return securityGroup;
    }

    private createBastionSecurityGroup(
        vpc: cdk.aws_ec2.IVpc
    ) {
        // IDの重複を防ぐため 'BastionSecurityGroup' に変更しています
        const securityGroup = new cdk.aws_ec2.SecurityGroup(this, 'BastionSecurityGroup', {
            vpc: vpc,
            allowAllOutbound: true,
        });

        return securityGroup;
    }
}