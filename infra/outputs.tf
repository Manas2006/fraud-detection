output "api_base_url" {
  description = "Base URL for the API Gateway"
  value       = module.api_gateway.base_url
}

output "web_url" {
  description = "URL for the web dashboard"
  value       = module.web_hosting.url
}

output "backend_service_url" {
  description = "Internal URL for the backend service"
  value       = module.ecs.backend_service_url
}

output "ml_service_url" {
  description = "Internal URL for the ML service"
  value       = module.ecs.ml_service_url
}

output "database_endpoint" {
  description = "RDS database endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = module.redis.endpoint
  sensitive   = true
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnets" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnets
}

output "private_subnets" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnets
} 