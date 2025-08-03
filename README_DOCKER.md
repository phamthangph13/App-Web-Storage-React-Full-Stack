# Docker Setup Guide for P2P Application

## Overview
This project uses Docker to containerize all components of the P2P application:
- **Backend**: Spring Boot API with JWT authentication
- **Frontend**: React/TypeScript website
- **Mobile**: React Native/Expo app
- **Database**: MongoDB
- **Reverse Proxy**: Nginx (optional)

## Prerequisites
- Docker Desktop installed
- Docker Compose installed
- At least 4GB RAM available for Docker

## Quick Start

### 1. Production Environment
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 2. Development Environment
```bash
# Build and start development services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development services
docker-compose -f docker-compose.dev.yml down
```

## Services Overview

### Production Services
| Service | Port | Description |
|---------|------|-------------|
| Backend API | 8080 | Spring Boot REST API |
| Website | 80 | React/TypeScript frontend |
| MongoDB | 27017 | Database |
| Nginx | 443/80 | Reverse proxy (optional) |

### Development Services
| Service | Port | Description |
|---------|------|-------------|
| Backend API | 8080 | Spring Boot with hot reload |
| Website | 3000 | React dev server |
| Mobile | 19000-19002 | Expo development server |
| MongoDB | 27017 | Database |
| Mongo Express | 8081 | Database management UI |

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DATABASE=p2p_app

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=86400000

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# API URLs
REACT_APP_API_URL=http://localhost:8080
```

### SSL Configuration (Production)
For HTTPS in production:

1. Create SSL certificates:
```bash
mkdir -p nginx/ssl
# Add your SSL certificates to nginx/ssl/
```

2. Uncomment SSL configuration in `nginx/nginx.conf`

## Development Workflow

### Backend Development
```bash
# Start backend with hot reload
docker-compose -f docker-compose.dev.yml up backend

# View backend logs
docker-compose -f docker-compose.dev.yml logs -f backend

# Access backend API
curl http://localhost:8080/api/health
```

### Frontend Development
```bash
# Start website with hot reload
docker-compose -f docker-compose.dev.yml up website

# Access website
open http://localhost:3000
```

### Mobile Development
```bash
# Start Expo development server
docker-compose -f docker-compose.dev.yml up mobile

# Access Expo DevTools
open http://localhost:19002
```

### Database Management
```bash
# Access MongoDB Express (development)
open http://localhost:8081

# Connect to MongoDB directly
docker exec -it p2p-mongodb-dev mongosh -u admin -p password123
```

## Useful Commands

### Container Management
```bash
# List running containers
docker ps

# View container logs
docker logs <container-name>

# Execute commands in container
docker exec -it <container-name> /bin/bash

# Stop specific service
docker-compose stop <service-name>

# Rebuild specific service
docker-compose build <service-name>
```

### Database Operations
```bash
# Backup database
docker exec p2p-mongodb-dev mongodump --out /backup

# Restore database
docker exec p2p-mongodb-dev mongorestore /backup

# View database logs
docker logs p2p-mongodb-dev
```

### Volume Management
```bash
# List volumes
docker volume ls

# Remove volumes
docker volume rm <volume-name>

# Clean up all volumes
docker volume prune
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
```bash
# Check what's using the port
netstat -tulpn | grep :8080

# Change port in docker-compose.yml
ports:
  - "8081:8080"  # Change host port
```

2. **Memory issues**
```bash
# Increase Docker memory limit in Docker Desktop
# Settings > Resources > Memory: 4GB+
```

3. **Build failures**
```bash
# Clean and rebuild
docker-compose down
docker system prune -a
docker-compose build --no-cache
```

4. **Database connection issues**
```bash
# Check MongoDB status
docker logs p2p-mongodb-dev

# Restart MongoDB
docker-compose restart mongodb
```

### Logs and Debugging
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f backend

# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## Production Deployment

### 1. Build Production Images
```bash
# Build all services
docker-compose build

# Push to registry (if using)
docker tag p2p-backend your-registry/p2p-backend:latest
docker push your-registry/p2p-backend:latest
```

### 2. Deploy with Environment Variables
```bash
# Set production environment variables
export JWT_SECRET=production-secret-key
export EMAIL_PASSWORD=production-email-password

# Start production services
docker-compose up -d
```

### 3. SSL Setup
```bash
# Generate SSL certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/nginx-selfsigned.key \
  -out nginx/ssl/nginx-selfsigned.crt

# Update nginx configuration
# Uncomment SSL lines in nginx/nginx.conf
```

## Security Considerations

1. **Change default passwords**
   - Update MongoDB credentials
   - Change JWT secret
   - Use strong email passwords

2. **Network security**
   - Use internal Docker networks
   - Limit exposed ports
   - Configure firewall rules

3. **SSL/TLS**
   - Use proper SSL certificates
   - Enable HTTPS redirect
   - Configure security headers

4. **Environment variables**
   - Never commit secrets to Git
   - Use Docker secrets for sensitive data
   - Rotate credentials regularly

## Performance Optimization

1. **Resource limits**
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
```

2. **Caching**
   - Enable Redis for session storage
   - Configure CDN for static assets
   - Use browser caching

3. **Monitoring**
   - Add health checks
   - Configure logging
   - Set up monitoring tools

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review container logs
3. Verify environment configuration
4. Test individual services 