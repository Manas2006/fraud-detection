variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "backend_image" {
  description = "Backend Docker image URI"
  type        = string
  default     = "ghcr.io/fraudshield/backend:latest"
}

variable "ml_image" {
  description = "ML service Docker image URI"
  type        = string
  default     = "ghcr.io/fraudshield/ml-service:latest"
}

variable "domain_name" {
  description = "Domain name for the web dashboard"
  type        = string
  default     = "fraudshield.example.com"
}

variable "twilio_account_sid" {
  description = "Twilio Account SID"
  type        = string
  sensitive   = true
}

variable "twilio_auth_token" {
  description = "Twilio Auth Token"
  type        = string
  sensitive   = true
} 