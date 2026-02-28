import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface VpcProps {}

export class Vpc extends Construct {
  public readonly vpc: ec2.Vpc;

  public readonly s3Endpoint: ec2.GatewayVpcEndpoint;

  constructor(scope: Construct, id: string, props: VpcProps) {
    super(scope, id);

    this.vpc = this.createVpc();
    this.addInterfaceEndpoints();
  }

  private createVpc(): ec2.Vpc {
    return new ec2.Vpc(this, 'LinuxLearningVPC', {
      vpcName: 'LinuxLearningVPC',
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      natGateways: 1,
      subnetConfiguration: [
        { cidrMask: 24, name: 'Public', subnetType: ec2.SubnetType.PUBLIC },
        { cidrMask: 24, name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }
      ],
      maxAzs: 1,
    });
  }

  /**
   * SSM/ECR/Logsなどのインターフェース型エンドポイントを一括追加
   */
  private addInterfaceEndpoints(): void {
    const endpointSubnets = { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS };

    const services = [
      { id: 'SsmEndpoint', service: ec2.InterfaceVpcEndpointAwsService.SSM },
      { id: 'SsmMessagesEndpoint', service: ec2.InterfaceVpcEndpointAwsService.SSM_MESSAGES },
      { id: 'Ec2MessagesEndpoint', service: ec2.InterfaceVpcEndpointAwsService.EC2_MESSAGES }
    ];
    services.forEach((s) => {
      this.vpc.addInterfaceEndpoint(s.id, {
        service: s.service,
        subnets: endpointSubnets,
      });
    });
  }
}