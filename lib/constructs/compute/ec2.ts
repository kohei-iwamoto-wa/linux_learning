import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

interface Ec2ConstructProps {
    targetVpc: ec2.IVpc;
    securityGroup?: ec2.ISecurityGroup;
    instanceType?: ec2.InstanceType;
    machineImage?: ec2.IMachineImage;
    subnetType?: ec2.SubnetType;
    createSecurityGroupIfMissing?: boolean;
}

export class Ec2 extends Construct {
    public readonly vpc: ec2.IVpc;
    public readonly instance: ec2.Instance;
    public readonly securityGroup: ec2.ISecurityGroup;

    constructor(scope: Construct, id: string, props: Ec2ConstructProps) {
        super(scope, id);
        this.vpc = props.targetVpc;

        const resolved = this.resolveDefaults(props);
        this.securityGroup = this.ensureSecurityGroup(props, resolved.subnetType);
        this.instance = this.createInstance(props, resolved);
    }

    private resolveDefaults(props: Ec2ConstructProps) {
        const instanceType = props.instanceType ?? new ec2.InstanceType('t3.micro');
        const machineImage = props.machineImage ?? ec2.MachineImage.latestAmazonLinux2();
        const subnetType = props.subnetType ?? ec2.SubnetType.PUBLIC;
        return { instanceType, machineImage, subnetType };
    }

    private createInstance(props: Ec2ConstructProps, resolved: { instanceType: ec2.InstanceType; machineImage: ec2.IMachineImage; subnetType: ec2.SubnetType; }) {
        return new ec2.Instance(this, 'AmiInstance', {
            instanceType: resolved.instanceType,
            machineImage: resolved.machineImage,
            vpc: this.vpc,
            vpcSubnets: this.vpc.selectSubnets({ subnetType: resolved.subnetType }),
            securityGroup: this.securityGroup,
            // SSM Managed Instance Core ポリシーを付与
            role: new iam.Role(this, 'Ec2InstanceRole', {
                assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
                managedPolicies: [
                    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
                ],
            }),
        });
    }

        // Ec2クラス内
    private ensureSecurityGroup(props: Ec2ConstructProps, subnetType: ec2.SubnetType): ec2.ISecurityGroup {
        const sg = props.securityGroup ?? new ec2.SecurityGroup(this, 'Ec2SecurityGroup', {
            vpc: this.vpc,
            allowAllOutbound: true,
        });

        // Redmine用のHTTPポート(80)を全開放（必要に応じて特定のIPに絞る）
        sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP access');
        
        // Session Manager経由のSSHやトンネルを利用する場合、22番を開ける必要はありません（SSMが代行するため）
        
        return sg;
    }
}