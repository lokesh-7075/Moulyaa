const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");
const path = require("path");

// Initialize AWS S3 Client
const getS3Client = () => {
  const region = process.env.AWS_REGION || "us-east-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (accessKeyId && secretAccessKey) {
    return new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
  }

  // Use default AWS credential chain (IAM Role on EC2, ECS, App Runner, Lambda)
  return new S3Client({ region });
};

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "moulyasree-tourism-bucket";

/**
 * Upload a local file buffer or stream to Amazon S3
 * @param {Object} options
 * @param {Buffer} options.fileBuffer - Buffer of the file
 * @param {string} options.fileName - Destination key in S3 (e.g., 'hotels/photo1.jpg')
 * @param {string} options.mimeType - File content type (e.g., 'image/jpeg')
 * @returns {Promise<{ url: string, key: string }>}
 */
const uploadToS3 = async ({ fileBuffer, fileName, mimeType = "application/octet-stream" }) => {
  const s3Client = getS3Client();
  const region = process.env.AWS_REGION || "us-east-1";

  // Standardize S3 Key path (replace backslashes with forward slashes)
  const cleanKey = fileName.replace(/\\/g, "/").replace(/^\/+/, "");

  if (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI || process.env.AWS_ROLE_ARN) {
    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: cleanKey,
        Body: fileBuffer,
        ContentType: mimeType,
        CacheControl: "max-age=31536000" // 1 year cache
      });

      await s3Client.send(command);

      // CloudFront domain or direct S3 URL
      const cdnDomain = process.env.AWS_CLOUDFRONT_DOMAIN;
      const fileUrl = cdnDomain 
        ? `https://${cdnDomain}/${cleanKey}`
        : `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${cleanKey}`;

      return {
        url: fileUrl,
        key: cleanKey,
        source: "AWS_S3"
      };
    } catch (error) {
      console.warn("⚠️ S3 Upload Warning (falling back to local storage):", error.message);
    }
  }

  // Local fallback if S3 not configured or during local offline development
  const localRelative = `uploads/${cleanKey}`;
  const localAbsolute = path.resolve(localRelative);
  const dir = path.dirname(localAbsolute);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(localAbsolute, fileBuffer);

  return {
    url: `/${localRelative.replace(/\\/g, "/")}`,
    key: cleanKey,
    source: "LOCAL_STORAGE"
  };
};

/**
 * Delete an object from Amazon S3
 * @param {string} key - S3 object key
 */
const deleteFromS3 = async (key) => {
  if (!key) return;
  const s3Client = getS3Client();
  const cleanKey = key.replace(/\\/g, "/").replace(/^\/+/, "");

  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: cleanKey
    });
    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("S3 Delete Error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Generate a pre-signed URL for direct browser-to-S3 uploads
 * @param {string} fileName
 * @param {string} mimeType
 * @param {number} expiresInSeconds
 */
const generatePresignedUploadUrl = async (fileName, mimeType = "image/jpeg", expiresInSeconds = 300) => {
  const s3Client = getS3Client();
  const cleanKey = `uploads/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: cleanKey,
    ContentType: mimeType
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  const region = process.env.AWS_REGION || "us-east-1";
  const cdnDomain = process.env.AWS_CLOUDFRONT_DOMAIN;
  const finalFileUrl = cdnDomain 
    ? `https://${cdnDomain}/${cleanKey}`
    : `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${cleanKey}`;

  return {
    uploadUrl,
    finalFileUrl,
    key: cleanKey
  };
};

module.exports = {
  uploadToS3,
  deleteFromS3,
  generatePresignedUploadUrl,
  getS3Client,
  BUCKET_NAME
};
