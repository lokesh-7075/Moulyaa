output "cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.frontend_cdn.domain_name
  description = "Global CloudFront Domain URL"
}

output "frontend_s3_bucket" {
  value       = aws_s3_bucket.frontend_bucket.bucket
  description = "S3 Bucket Name for Static Website Hosting"
}

output "media_s3_bucket" {
  value       = aws_s3_bucket.media_bucket.bucket
  description = "S3 Bucket Name for Media/Image Storage"
}
