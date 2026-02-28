#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LinuxLearningStack } from '../lib/linux_learning-stack';

const app = new cdk.App();
new LinuxLearningStack(app, 'LinuxLearningStack', {});