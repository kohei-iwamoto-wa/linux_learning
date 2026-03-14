import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as iam from 'aws-cdk-lib/aws-iam';

interface StackCleanupProps {
    targetStackName?: string;
    schedule: cdk.aws_events.Schedule;
}

export class StackCleanup extends Construct {
    constructor(scope: Construct, id: string, props: StackCleanupProps) {
        super(scope, id);

        const stackName = props.targetStackName ?? cdk.Stack.of(this).stackName;

        const schedulerRole = new iam.Role(this, 'SchedulerRole', {
            assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
        });

        schedulerRole.addToPolicy(new iam.PolicyStatement({
            actions: ['cloudformation:DeleteStack'],
            resources: [
                `arn:aws:cloudformation:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:stack/${stackName}/*`
            ],
        }));

        new scheduler.CfnSchedule(this, 'DeleteStackSchedule', {
            flexibleTimeWindow: { mode: 'OFF' },
            scheduleExpression: props.schedule.expressionString,
            scheduleExpressionTimezone: 'Asia/Tokyo', 
            target: {
                arn: 'arn:aws:scheduler:::aws-sdk:cloudformation:deleteStack',
                roleArn: schedulerRole.roleArn,
                input: JSON.stringify({
                    StackName: stackName,
                }),
            },
        });
    }
}