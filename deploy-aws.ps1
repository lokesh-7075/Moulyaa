# ==============================================================================
# 🚀 1-Click AWS Deployment Script for Moulyasree Platform (Windows PowerShell)
# ==============================================================================

$ErrorActionPreference = "Stop"
$env:PYTHONIOENCODING = "utf-8"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "🌍 Moulyasree Tourism Platform - AWS Cloud Deployment" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Ensure AWS CLI is in current PATH
if (Test-Path "C:\Program Files\Amazon\AWSCLIV2") {
    $env:Path = "C:\Program Files\Amazon\AWSCLIV2;" + $env:Path
}

$AWS_REGION = if ($env:AWS_REGION -and $env:AWS_REGION -ne "N/A") { $env:AWS_REGION } else { "us-east-1" }
$STACK_NAME = if ($env:STACK_NAME) { $env:STACK_NAME } else { "moulyasree-production-stack" }

# Set environment region for AWS CLI
$env:AWS_DEFAULT_REGION = $AWS_REGION

# Check for AWS CLI
if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Host "❌ AWS CLI was not found. Please verify the installation." -ForegroundColor Red
    exit 1
}

Write-Host "🔑 Verifying AWS CLI authentication in region '$AWS_REGION'..." -ForegroundColor Yellow
try {
    aws sts get-caller-identity --region $AWS_REGION
} catch {
    Write-Host "⚠️ AWS CLI authentication failed. Please check your credentials." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 [Step 1/4] Deploying AWS CloudFormation Infrastructure..." -ForegroundColor Green
aws cloudformation deploy `
    --template-file aws/cloudformation/moulyasree-stack.yml `
    --stack-name $STACK_NAME `
    --capabilities CAPABILITY_NAMED_IAM `
    --region $AWS_REGION

Write-Host ""
Write-Host "⚡ [Step 2/4] Initializing Amazon DynamoDB Pan-India Inventory..." -ForegroundColor Green
node server/scripts/initDynamoTables.js

Write-Host ""
Write-Host "🌐 [Step 3/4] Building and Syncing Client React App to Amazon S3..." -ForegroundColor Green
node aws/scripts/deploy-frontend-s3.js

Write-Host ""
Write-Host "🎉 [Step 4/4] Deployment Complete!" -ForegroundColor Cyan
Write-Host "CloudFormation Outputs:" -ForegroundColor Yellow
try {
    aws cloudformation describe-stacks `
        --stack-name $STACK_NAME `
        --region $AWS_REGION `
        --query "Stacks[0].Outputs" `
        --output table
} catch {
    Write-Host "Stack outputs will be available once CloudFormation finishes creating all resources." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Moulyasree is now live globally on AWS!" -ForegroundColor Green
