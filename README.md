# FraudShield - Fraud Detection MVP

A comprehensive fraud detection system that ingests phone calls, SMS, and email text, scores them for fraud risk using a BERT model, stores results, and notifies users.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Spring Boot    │    │   FastAPI ML    │
│   (Port 3000)   │◄──►│   Backend       │◄──►│   Service       │
│                 │    │   (Port 8080)   │    │   (Port 8000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   (Port 5432)   │
                       └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   (Port 6379)   │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Java 17 (for local development)
- Node.js 18 (for local development)
- Python 3.11 (for local development)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fraud-detection
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - ML Service: http://localhost:8000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

### Manual Setup (Alternative)

If you prefer to run services individually:

1. **Start PostgreSQL and Redis**
   ```bash
   docker-compose up postgres redis -d
   ```

2. **Start ML Service**
   ```bash
   cd ml-service
   pip install -r requirements.txt
   python main.py
   ```

3. **Start Backend**
   ```bash
   cd springboot-backend
   ./gradlew bootRun
   ```

4. **Start Frontend**
   ```bash
   cd web-dashboard
   npm install
   npm run dev
   ```

## 📋 API Endpoints

### Classification
- `POST /api/classify` - Classify text for fraud risk
  ```json
  {
    "message": "Your account has been suspended...",
    "channel": "EMAIL"
  }
  ```

### Messages
- `GET /api/messages/{userId}?since=2024-01-01T00:00:00Z` - Get user messages
- `GET /api/messages/stats/{userId}` - Get message statistics

### Twilio Webhooks
- `POST /twilio/sms` - Handle SMS webhooks
- `POST /twilio/voice` - Handle voice call webhooks

## 🧪 Testing

### Backend Tests
```bash
cd springboot-backend
./gradlew test
```

### ML Service Tests
```bash
cd ml-service
python -m pytest tests/ -v
```

### Frontend Tests
```bash
cd web-dashboard
npm test
```

## 🏗️ Infrastructure

### AWS Deployment

The infrastructure is managed with Terraform and includes:

- **VPC** with public and private subnets
- **RDS PostgreSQL** for data persistence
- **ElastiCache Redis** for caching
- **ECS Fargate** for containerized services
- **API Gateway** for API management
- **S3 + CloudFront** for web hosting
- **CloudWatch** for monitoring

### Deployment

1. **Set up AWS credentials**
   ```bash
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

2. **Initialize Terraform**
   ```bash
   cd infra
   terraform init
   ```

3. **Deploy**
   ```bash
   terraform plan
   terraform apply
   ```

## 🔧 Configuration

### Environment Variables

#### Backend
- `SPRING_DATASOURCE_URL` - PostgreSQL connection string
- `SPRING_REDIS_HOST` - Redis host
- `ML_SERVICE_URL` - ML service endpoint

#### ML Service
- `MODEL_PATH` - Path to fine-tuned BERT model
- `MAX_LENGTH` - Maximum text length for classification

#### Frontend
- `VITE_API_URL` - Backend API URL

## 📊 Monitoring

### CloudWatch Dashboards

- **API Gateway Metrics**: Request count, latency, error rate
- **ECS Service Metrics**: CPU, memory, task count
- **RDS Metrics**: Connection count, query performance
- **Custom Metrics**: Fraud detection accuracy, response times

### Grafana Dashboards

Access Grafana at the provided URL to view:
- Real-time fraud detection metrics
- System performance indicators
- Twilio cost analysis

## 🔒 Security

- **Rate Limiting**: 10 req/sec/user with 20 burst
- **Authentication**: JWT-based authentication (stub implementation)
- **Input Validation**: Comprehensive request validation
- **HTTPS**: All external communications encrypted
- **VPC Isolation**: Services run in private subnets

## 📈 Performance

- **Target Latency**: < 200ms median response time
- **Caching**: Redis-based caching for identical texts
- **Database**: Optimized indexes for message queries
- **Load Balancing**: ECS service load balancing

## 🚀 CI/CD Pipeline

The GitHub Actions pipeline includes:

1. **Testing**: Unit tests for all services
2. **Building**: Docker image creation
3. **Security**: Vulnerability scanning
4. **Deployment**: Automated AWS deployment
5. **Monitoring**: Health checks and rollback

## 📝 Development

### Adding New Features

1. **Backend**: Add controllers, services, and repositories
2. **ML Service**: Enhance model or add new endpoints
3. **Frontend**: Create new React components and pages
4. **Infrastructure**: Update Terraform modules as needed

### Code Quality

- **Backend**: 90% unit test coverage target
- **Frontend**: ESLint and TypeScript strict mode
- **ML Service**: Pytest with coverage reporting
- **Infrastructure**: Terraform validation and formatting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

---

**FraudShield** - Protecting users from fraud, one message at a time. 