# MyCoverGenius Backend Engineer Assessment

## Overview
A mini InsureTech API built with NestJS that allows users to buy insurance products (plans) using their wallet and activate policies from purchased plans.

## Tech Stack
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Sequelize with TypeScript
- **Testing**: Jest
- **Validation**: class-validator
- **Language**: TypeScript

## Domain Concepts

### Products
Insurance products with pricing, categorized as:
- **Health Products**:
  - Optimal care mini: ₦10,000
  - Optimal care standard: ₦20,000
- **Auto Products**:
  - Third-party: ₦5,000
  - Comprehensive: ₦15,000

### Plans
Created when products are purchased. Payment is calculated by `product_price × quantity`. Each plan creates pending policy slots equal to the quantity purchased.

### Pending Policies
Unused slots under a plan that can be activated into policies. Status: `unused` → `used` (soft deleted).

### Policies
Activated pending policies with unique policy numbers. Constraints: One user can only have one policy per product type.

## Database Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v12+)
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/dEnchanter/mini-insuretech-api.git
cd <into-directory>

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### Environment Variables
```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=cover_genius
```

### Database Setup
```bash
# Create database
createdb cover_genius

# Start the application (will auto-create tables and seed data)
npm run start:dev
```

## API Endpoints

### 1. Get Products
```http
GET /api/v1/products
```
**Response**: List of all products with categories and pricing.

### 2. Purchase Plan
```http
POST /api/v1/plans
Content-Type: application/json

{
  "userId": 1,
  "productId": 1,
  "quantity": 2
}
```
**Response**: Created plan with pending policies.

### 3. Get Pending Policies
```http
GET /api/v1/plans/:id/pending-policies
```
**Response**: List of unused pending policies for a plan.

### 4. Activate Policy
```http
POST /api/v1/policies/activate
Content-Type: application/json

{
  "pendingPolicyId": 1
}
```
**Response**: Activated policy with unique policy number.

### 5. List Policies
```http
GET /api/v1/policies
```
**Optional Query Parameter**: `?planId=1` to filter by plan.
**Response**: List of all activated policies.

## Testing

### Unit Tests
```bash
# Run unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

### Integration Tests
```bash
# Run e2e tests
npm run test:e2e
```

## Development Commands

```bash
# Development
npm run start:dev          # Watch mode
npm run start:debug        # Debug mode

# Building
npm run build             # Build application
npm run start:prod        # Production mode

# Code Quality
npm run lint              # ESLint
npm run format            # Prettier
```

## Sample Usage Flow

1. **View Available Products**
   ```bash
   curl http://localhost:3000/api/v1/products
   ```

2. **Purchase a Plan** (User 1 buys 2 Optimal care mini)
   ```bash
   curl -X POST http://localhost:3000/api/v1/plans \
     -H "Content-Type: application/json" \
     -d '{"userId": 1, "productId": 1, "quantity": 2}'
   ```

3. **View Pending Policies**
   ```bash
   curl http://localhost:3000/api/v1/plans/1/pending-policies
   ```

4. **Activate a Policy**
   ```bash
   curl -X POST http://localhost:3000/api/v1/policies/activate \
     -H "Content-Type: application/json" \
     -d '{"pendingPolicyId": 1}'
   ```

5. **View All Policies**
   ```bash
   curl http://localhost:3000/api/v1/policies
   ```

## Seeded Data

The application automatically seeds:
- **Users**: 3 users with wallet balances
- **Product Categories**: Health and Auto
- **Products**: 4 insurance products as specified

## Business Rules

1. ✅ Users can only have one policy per product type
2. ✅ Wallet balance is deducted when purchasing plans
3. ✅ Pending policies are soft-deleted when activated
4. ✅ Policy numbers are uniquely generated
5. ✅ All database relationships properly implemented

## Architecture

- **Entities**: Database models with Sequelize decorators
- **Controllers**: HTTP request handlers
- **Services**: Business logic and database operations
- **DTOs**: Request/response validation
- **Seeders**: Database initialization
- **Tests**: Unit and integration test coverage

## Project Structure
```
src/
├── entities/          # Database models
├── config/            # Database configuration
├── products/          # Products module
├── plans/             # Plans module  
├── policies/          # Policies module
├── seeders/           # Database seeders
└── main.ts            # Application entry point
```