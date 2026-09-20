variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS Region for resource deployment"
}

variable "app_name" {
  type        = string
  default     = "moulyasree"
  description = "Base application name for resource naming"
}

variable "environment" {
  type        = string
  default     = "prod"
  description = "Deployment environment (prod / dev / staging)"
}
