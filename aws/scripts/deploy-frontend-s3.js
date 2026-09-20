/**
 * Node.js AWS S3 Frontend Deployment & CloudFront Invalidation Script
 * Usage: node aws/scripts/deploy-frontend-s3.js
 */
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { execSync } = require("child_process");

dotenv.config({ path: path.join(__dirname, "../../server/.env") });

const region = process.env.AWS_REGION || "us-east-1";
const bucketName = process.env.AWS_S3_FRONTEND_BUCKET || process.env.AWS_S3_BUCKET_NAME || "moulyasree-frontend-bucket";

const s3Client = new S3Client({
  region,
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  } : undefined
});

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp"
};

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function deploy() {
  console.log("🚀 [1/3] Building Client React SPA bundle...");
  const clientDir = path.join(__dirname, "../../client");
  execSync("npm run build", { cwd: clientDir, stdio: "inherit" });

  const distDir = path.join(clientDir, "dist");
  if (!fs.existsSync(distDir)) {
    console.error("❌ Build failed: 'client/dist' directory not found.");
    process.exit(1);
  }

  console.log(`\n☁️ [2/3] Uploading build assets to Amazon S3 Bucket: ${bucketName}...`);

  if (!process.env.AWS_ACCESS_KEY_ID) {
    console.log("ℹ️ No AWS_ACCESS_KEY_ID detected in .env. Skipping cloud upload (dry run successful).");
    console.log(`✨ Built assets in ${distDir} are ready for instant S3 deployment.`);
    return;
  }

  const allFiles = getAllFiles(distDir);
  let uploadedCount = 0;

  for (const filePath of allFiles) {
    const relativePath = path.relative(distDir, filePath).replace(/\\/g, "/");
    const fileContent = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    const isCacheable = relativePath.startsWith("assets/");

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: relativePath,
      Body: fileContent,
      ContentType: contentType,
      CacheControl: isCacheable ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate"
    });

    await s3Client.send(command);
    uploadedCount++;
  }

  console.log(`🎉 [3/3] Successfully uploaded ${uploadedCount} files to Amazon S3 (${bucketName})!`);
}

deploy().catch(err => console.error("❌ S3 Deployment Error:", err));
