import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface AuroraClusterProps {
    vpc: cdk.aws_ec2.IVpc;
    securityGroup: cdk.aws_ec2.ISecurityGroup;
    masterUserPassword?: cdk.SecretValue;
}

export class AuroraCluster extends Construct {
    public readonly cluster: cdk.aws_rds.DatabaseCluster;

    constructor(scope: Construct, id: string, props: AuroraClusterProps) {
        super(scope, id);

        const credentials = cdk.aws_rds.Credentials.fromPassword(
            'postgres', 
            props.masterUserPassword ?? cdk.SecretValue.unsafePlainText('YourPassword123!') 
        );

        // Aurora PostgreSQL クラスタの作成
        this.cluster = new cdk.aws_rds.DatabaseCluster(this, 'AuroraCluster', {
            engine: cdk.aws_rds.DatabaseClusterEngine.auroraPostgres({
                version: cdk.aws_rds.AuroraPostgresEngineVersion.VER_17_4,
            }),
            credentials: credentials,
            vpc: props.vpc,
            vpcSubnets: {
                subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
            },
            securityGroups: [props.securityGroup],
            writer: cdk.aws_rds.ClusterInstance.provisioned('Writer', {
                instanceType: cdk.aws_ec2.InstanceType.of(
                    cdk.aws_ec2.InstanceClass.T4G,
                    cdk.aws_ec2.InstanceSize.MEDIUM
                ),
            }),
        });
    }
}