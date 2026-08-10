import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

interface Ec2ConstructProps {
    targetVpc: ec2.IVpc;
    instanceType?: ec2.InstanceType;
    machineImage?: ec2.IMachineImage;
    subnetType?: ec2.SubnetType;
    createSecurityGroupIfMissing?: boolean;
    securityGroup: ec2.ISecurityGroup;
}

export class Ec2 extends Construct {
    public readonly vpc: ec2.IVpc;
    public readonly instance: ec2.Instance;
    public readonly securityGroup: ec2.ISecurityGroup;

    constructor(scope: Construct, id: string, props: Ec2ConstructProps) {
        super(scope, id);
        this.vpc = props.targetVpc;

        const resolved = this.resolveDefaults(props);
        this.instance = this.createInstance(props, resolved);
    }

    private resolveDefaults(props: Ec2ConstructProps) {
        const instanceType = props.instanceType ?? new ec2.InstanceType('t3.micro');
        const machineImage = props.machineImage ?? ec2.MachineImage.latestAmazonLinux2023();
        const subnetType = props.subnetType ?? ec2.SubnetType.PUBLIC;
        return { instanceType, machineImage, subnetType };
    }

    private createInstance(props: Ec2ConstructProps, resolved: { instanceType: ec2.InstanceType; machineImage: ec2.IMachineImage; subnetType: ec2.SubnetType; }) {
        const userData = ec2.UserData.forLinux();
        userData.addCommands(
            'sudo dnf update -y',
            'sudo dnf install -y postgresql17'
        );

        return new ec2.Instance(this, 'AmiInstance', {
            instanceType: resolved.instanceType,
            machineImage: resolved.machineImage,
            vpc: this.vpc,
            vpcSubnets: this.vpc.selectSubnets({ subnetType: resolved.subnetType }),
            securityGroup: props.securityGroup,
            userData: userData,
            // SSM Managed Instance Core ポリシーを付与
            role: new iam.Role(this, 'Ec2InstanceRole', {
                assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
                managedPolicies: [
                    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
                    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryPowerUser'),
                ],
            }),
        });
    }
}