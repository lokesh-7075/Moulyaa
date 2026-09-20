#!/usr/bin/env bash
# ==============================================================================
# 🚀 1-Click AWS Deployment Script for Moulyasree Platform (Linux / macOS)
# ==============================================================================

set -e

echo "====================================================="
echo "🌍 Moulyasree Tourism Platform - AWS Cloud Deployment"
echo "====================================================="

AWS_REGION="${AWS_REGION:-us-east-1}"
STACK_NAME="${STACK_NAME:-moulyasree-production-stack}"

# Check for AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it from https://aws.amazon.com/cli/"
    exit 1
fi

echo "🔑 Verifying AWS CLI authentication..."
aws sts get-caller-identity

echo ""
echo "📦 [Step 1/4] Deploying AWS CloudFormation Infrastructure..."
aws cloudformation deploy \
    --template-file aws/cloudformation/moulyasree-stack.yml \
    --stack-name "$STACK_NAME" \
    --capabilities CAPABILITY_NAMED_IAM \
    --region "$AWS_REGION"

echo ""
echo "⚡ [Step 2/4] Initializing Amazon DynamoDB Pan-India Inventory..."
node server/scripts/initDynamoTables.js

echo ""
echo "🌐 [Step 3/4] Building and Syncing Client React App to Amazon S3..."
node aws/scripts/deploy-frontend-s3.js

echo ""
echo "🎉 [Step 4/4] Deployment Complete!"
echo "Outputs from CloudFormation:"
aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --query "Stacks[0].Outputs" \
    --output table

echo ""
echo "✨ Moulyasree is now live on AWS!"
