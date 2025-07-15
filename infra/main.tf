terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "fraudshield-terraform-state"
    key    = "dev/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "fraudshield"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# VPC and Networking
module "vpc" {
  source = "./modules/vpc"
  
  environment = var.environment
  vpc_cidr    = var.vpc_cidr
}

# RDS PostgreSQL
module "rds" {
  source = "./modules/rds"
  
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
  db_password     = var.db_password
}

# ElastiCache Redis
module "redis" {
  source = "./modules/redis"
  
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
}

# ECS Cluster and Services
module "ecs" {
  source = "./modules/ecs"
  
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  public_subnets  = module.vpc.public_subnets
  private_subnets = module.vpc.private_subnets
  
  backend_image = var.backend_image
  ml_image      = var.ml_image
  
  db_endpoint = module.rds.endpoint
  redis_endpoint = module.redis.endpoint
}

# API Gateway
module "api_gateway" {
  source = "./modules/api_gateway"
  
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  
  backend_service_url = module.ecs.backend_service_url
}

# S3 and CloudFront for Web Dashboard
module "web_hosting" {
  source = "./modules/web_hosting"
  
  environment = var.environment
  domain_name = var.domain_name
}

# CloudWatch Dashboards
module "monitoring" {
  source = "./modules/monitoring"
  
  environment = var.environment
  api_gateway_id = module.api_gateway.id
  backend_service_name = module.ecs.backend_service_name
  ml_service_name = module.ecs.ml_service_name
} 