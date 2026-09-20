terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ==========================================
# 🪣 S3 Static Frontend Bucket (Client & Admin)
# ==========================================
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "${var.app_name}-frontend-${var.environment}"
}

resource "aws_s3_bucket_website_configuration" "frontend_website" {
  bucket = aws_s3_bucket.frontend_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# ==========================================
# 🖼️ S3 Media Bucket (Hotel/Car/Guide Photos)
# ==========================================
resource "aws_s3_bucket" "media_bucket" {
  bucket = "${var.app_name}-media-${var.environment}"
}

resource "aws_s3_bucket_cors_configuration" "media_cors" {
  bucket = aws_s3_bucket.media_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    max_age_seconds = 3600
  }
}

# ==========================================
# 🌐 Amazon CloudFront Distribution (CDN)
# ==========================================
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${var.app_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "frontend_cdn" {
  enabled             = true
  default_root_object = "index.html"
  comment             = "CDN for ${var.app_name} Frontend"

  origin {
    domain_name              = aws_s3_bucket.frontend_bucket.bucket_regional_domain_name
    origin_id                = "S3Origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3Origin"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# ==========================================
# ⚡ DynamoDB Pan-India Inventory Tables
# ==========================================
resource "aws_dynamodb_table" "hotels" {
  name         = "Moulyasree_Hotels"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "vehicles" {
  name         = "Moulyasree_Vehicles"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "restaurants" {
  name         = "Moulyasree_Restaurants"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "guides" {
  name         = "Moulyasree_Guides"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "bookings" {
  name         = "Moulyasree_Bookings"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "bookingId"

  attribute {
    name = "bookingId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "trip_plans" {
  name         = "Moulyasree_TripPlans"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "planId"

  attribute {
    name = "planId"
    type = "S"
  }
}

# ==========================================
# 📊 Amazon CloudWatch Log Group
# ==========================================
resource "aws_cloudwatch_log_group" "api_logs" {
  name              = "/aws/${var.app_name}/api"
  retention_in_days = 30
}
