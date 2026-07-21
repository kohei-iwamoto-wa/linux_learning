import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as LinuxLearning from '../lib/linux_learning-stack';


test('Snapshot test', () => {
    const app = new cdk.App();
    const stack = new LinuxLearning.LinuxLearningStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
});
