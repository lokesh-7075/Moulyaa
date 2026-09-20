# 🌍 Moulyasree Tourism Platform — Complete AWS Deployment & Architecture Guide

Welcome to the official AWS deployment documentation for the **Moulyasree Tourism & AI Concierge Platform**. This guide provides step-by-step instructions to deploy Moulyasree onto production AWS cloud infrastructure using native AWS managed services.

---

## 🏛️ High-Level AWS Architecture

```mermaid
flowchart TD
    subgraph Users & Edge
        ClientUsers([🌍 Travelers & Visitors]) -->|HTTPS| R53[Amazon Route 53 DNS]
        AdminUsers([👑 Platform Admins & Vendors]) -->|HTTPS| R53
        R53 --> CF[Amazon CloudFront CDN + WAF]
    end

    subgraph Static Web Hosting Tier
        CF -->|/ (Client SPA)| S3_Client[Amazon S3 Static Bucket\nclient/dist]
        CF -->|/admin (Admin Portal)| S3_Admin[Amazon S3 Static Bucket\nadmin/dist]
    end

    subgraph Compute & API Tier
        CF -->|/api/* Requests| AppRunner[AWS App Runner / ECS Fargate\nExpress API Node.js Container]
        ECR[Amazon ECR\nDocker Registry] --> AppRunner
    end

    subgraph Generative AI & Media Tier
        AppRunner -->|Claude 3 / Titan API| Bedrock[Amazon Bedrock\nTravel Concierge & Vision AI]
        AppRunner -->|Direct Uploads & Presigned URLs| S3_Media[Amazon S3 Media Bucket\nmoulyasree-tourism-media]
    end

    subgraph Data & Storage Tier
        AppRunner -->|Low Latency Catalog & Caching| DynamoDB[(Amazon DynamoDB\nPan-India Verified Inventory)]
        AppRunner -->|Users, Bookings, Reviews| DocDB[(Amazon DocumentDB / MongoDB Atlas\nEncrypted Clusters)]
    end

    subgraph Security & Observability
        IAM[AWS IAM Roles] -.-> AppRunner
        SSM[AWS SSM / Secrets Manager] -.-> AppRunner
        AppRunner -->|Logs & Alarms| CW[Amazon CloudWatch]
    end
```

---

## ☁️ AWS Services Summary

| AWS Service | Functionality | Why It Was Chosen |
| :--- | :--- | :--- |
| **Amazon S3** | Static website hosting for Vite React builds (`client` & `admin`) + Media bucket for images | 99.999999999% durability, zero server maintenance, cost effective. |
| **Amazon CloudFront** | Global Content Delivery Network (CDN) with SSL/TLS edge caching and SPA fallback | Sub-50ms latency across India and worldwide, free HTTPS via ACM. |
| **AWS App Runner / ECS** | Auto-scaling containerized Node.js API runtime | Zero server management, auto-scales from 1 to 10 instances on demand. |
| **Amazon ECR** | Private Docker registry for backend container images | Native AWS security, IAM integration, automatic vulnerability scanning. |
| **Amazon Bedrock** | GenAI Travel Concierge, Itinerary Builder, and Multimodal Vision | Enterprise Claude 3 foundation models without managing GPU servers. |
| **Amazon DynamoDB** | Ultra-fast NoSQL distributed tables for Pan-India tourism inventory | Single-digit millisecond latency, On-Demand billing (pay only per query). |
| **Amazon DocumentDB** | MongoDB-compatible managed document database for Mongoose schemas | Fully managed, automated backups, TLS encryption at rest. |
| **AWS IAM** | Role-based least-privilege security permissions | Allows backend containers to query Bedrock, S3, and DynamoDB without hardcoded API keys. |
| **Amazon CloudWatch** | Centralized structured JSON logging and error monitoring | Real-time observability and alarm triggering on latency or 5xx spikes. |

---

## 🚀 Quick Deployment Options

### Option A: 1-Click Deployment via Automated Scripts (Recommended)

#### Prerequisites:
1. [AWS CLI installed and configured](https://aws.amazon.com/cli/) (`aws configure`).
2. Node.js 18+ installed.

#### On Windows (PowerShell):
```powershell
.\deploy-aws.ps1
```

#### On Linux / macOS (Bash):
```bash
chmod +x deploy-aws.sh
./deploy-aws.sh
```

---

### Option B: Step-by-Step Deployment via AWS CloudFormation & CLI

#### Step 1: Deploy Core AWS Cloud Infrastructure
Deploy the CloudFormation stack to provision S3 buckets, CloudFront CDN, DynamoDB tables, and IAM roles:

```bash
aws cloudformation deploy \
  --template-file aws/cloudformation/moulyasree-stack.yml \
  --stack-name moulyasree-production-stack \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

#### Step 2: Seed Amazon DynamoDB Inventory
Run the automated table setup and catalog loader:
```bash
node server/scripts/initDynamoTables.js
```

#### Step 3: Build and Deploy Frontend to Amazon S3
Build the client application and upload production assets to S3:
```bash
node aws/scripts/deploy-frontend-s3.js
```

#### Step 4: Invalidate CloudFront Cache (Optional)
```bash
aws cloudfront create-invalidation --distribution-id <YOUR_DISTRIBUTION_ID> --paths "/*"
```

---

### Option C: Backend Container Deployment via AWS App Runner

AWS App Runner provides the fastest, most reliable way to run the containerized backend:

1. **Build and push the Docker image to Amazon ECR**:
   ```bash
   # 1. Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

   # 2. Create ECR repository (if not existing)
   aws ecr create-repository --repository-name moulyasree-api --region us-east-1

   # 3. Build & Tag Docker image
   cd server
   docker build -t moulyasree-api .
   docker tag moulyasree-api:latest <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/moulyasree-api:latest

   # 4. Push to ECR
   docker push <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/moulyasree-api:latest
   ```

2. **Create AWS App Runner Service**:
   - Go to **AWS Console $\rightarrow$ AWS App Runner $\rightarrow$ Create Service**.
   - Choose **Container registry $\rightarrow$ Amazon ECR**.
   - Select `moulyasree-api:latest`.
   - Set Port to `5000`.
   - Under **Instance Role**, select `moulyasree-backend-instance-role-us-east-1` (created by the CloudFormation stack).
   - Add environment variables:
     - `NODE_ENV=production`
     - `MONGO_URI=<Your MongoDB / DocumentDB Connection String>`
     - `JWT_SECRET=<Your JWT Secret>`
     - `AWS_S3_BUCKET_NAME=moulyasree-media-<YOUR_ACCOUNT_ID>-us-east-1`
     - `BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0`
   - Click **Create & Deploy**.

---

## 🤖 Activating Amazon Bedrock in AWS Console

To use Claude 3 Haiku / Sonnet for AI Trip Planning and Multimodal Vision:

1. Log into the [AWS Management Console](https://console.aws.amazon.com/).
2. Navigate to **Amazon Bedrock** $\rightarrow$ select region (e.g. `us-east-1` or `us-west-2`).
3. In the left navigation sidebar, click **Model access**.
4. Click **Modify model access** or **Enable specific models**.
5. Check the box for **Anthropic $\rightarrow$ Claude 3 Haiku** and **Claude 3 Sonnet**.
6. Click **Request model access** (access is granted instantly in seconds).

---

## 🔒 Production Environment Variables Reference

### Backend (`server/.env` or AWS App Runner / Secrets Manager):

```ini
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://username:password@docdb-cluster.us-east-1.docdb.amazonaws.com:27017/moulyasree?tls=true
JWT_SECRET=super_secret_jwt_key_2026
STRIPE_SECRET_KEY=sk_live_...

# AWS Configuration
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=moulyasree-media-your-account-id-us-east-1
AWS_CLOUDFRONT_DOMAIN=d111111abcdef8.cloudfront.net
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
USE_S3_STORAGE=true
```

### Client Frontend (`client/.env`):

```ini
VITE_API_URL=https://<your-apprunner-url>.us-east-1.awsapprunner.com/api
VITE_BASE_URL=https://<your-apprunner-url>.us-east-1.awsapprunner.com
```

---

## 📊 Monitoring & Health Checks

1. **CloudWatch Structured Logs**:
   - Access logs in AWS Console $\rightarrow$ **CloudWatch $\rightarrow$ Log Groups $\rightarrow$ `/aws/moulyasree/api`**.
2. **API Health Endpoint**:
   - `GET /health` $\rightarrow$ Returns `{"status":"HEALTHY","uptimeSeconds":1234}`
3. **AWS Architecture Diagnostic Endpoint**:
   - `GET /api/aws/status` $\rightarrow$ Returns active AWS services, Bedrock status, DynamoDB tables, and region info.

---

## 💡 Cost Optimization Tips

- **DynamoDB**: Configured with `PAY_PER_REQUEST` (On-Demand), meaning $0.00 cost when there is no traffic.
- **Bedrock AI**: Incurs charges only per token generated with zero idle server cost.
- **S3 & CloudFront**: Free tier includes 50 GB data transfer and 1,000,000 requests/month.
- **App Runner**: Pauses container resources when idle to minimize hourly compute expenses.
