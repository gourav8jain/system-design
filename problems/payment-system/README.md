# 💳 Payment System Design

> **Design a scalable payment processing system that can handle millions of transactions with multiple payment methods, fraud detection, and financial compliance.**

## 📋 **Problem Statement**

Design a payment system that can:
- Process payments via multiple methods (credit cards, digital wallets, bank transfers)
- Handle millions of transactions per day
- Detect and prevent fraud
- Ensure PCI DSS compliance
- Support international payments and currencies
- Provide real-time transaction status
- Handle refunds and chargebacks
- Generate financial reports and analytics

## 🎯 **Requirements**

### ✅ **Functional Requirements**
- **Payment Processing**: Credit cards, digital wallets, bank transfers
- **Multi-currency Support**: USD, EUR, GBP, INR, etc.
- **Fraud Detection**: Real-time fraud screening and prevention
- **Transaction Management**: Authorize, capture, refund, void
- **Settlement**: Daily settlement and reconciliation
- **Reporting**: Transaction reports, analytics, compliance reports
- **Webhooks**: Real-time transaction notifications
- **Recurring Payments**: Subscription and installment payments

### 📊 **Non-Functional Requirements**
- **Scale**: Handle 10M+ transactions per day
- **Performance**: < 500ms for payment processing
- **Availability**: 99.99% uptime
- **Security**: PCI DSS Level 1 compliance
- **Reliability**: 99.9% transaction success rate
- **Compliance**: SOX, GDPR, local regulations

## 📈 **Scale Estimation**

### 🚀 **Traffic Estimation**
```
Daily Active Users (DAU): 10M
Transactions per user per day: 2
Total transactions per day: 20M
Average transaction value: $50
Daily transaction volume: $1B
Payment methods distribution:
- Credit Cards: 60% (12M transactions)
- Digital Wallets: 30% (6M transactions)
- Bank Transfers: 10% (2M transactions)
Storage for transactions: 20M * 5KB = 100GB per day
```

## 🏗️ **High-Level Architecture**

### 📊 **System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   Mobile App    │    │   POS Terminal   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Load Balancer        │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      API Gateway          │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Payment Gateway         │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│  Fraud Detection  │  │  Payment Router   │  │  Risk Assessment  │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Payment Processors      │
                    │  (Stripe, PayPal, etc.)   │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Event Stream (Kafka)    │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Cache (Redis)        │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Database Layer       │
                    │   (PostgreSQL + MongoDB)  │
                    └───────────────────────────┘
```

## 🗄️ **Database Design**

### 📊 **Transactions Table (PostgreSQL)**
```sql
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    merchant_id BIGINT NOT NULL,
    customer_id BIGINT,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL, -- 'credit_card', 'digital_wallet', 'bank_transfer'
    payment_processor VARCHAR(50) NOT NULL, -- 'stripe', 'paypal', 'adyen'
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'authorized', 'captured', 'failed', 'refunded'
    fraud_score DECIMAL(3,2),
    risk_level VARCHAR(20), -- 'low', 'medium', 'high'
    processor_transaction_id VARCHAR(100),
    processor_response JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    authorized_at TIMESTAMP,
    captured_at TIMESTAMP,
    settled_at TIMESTAMP,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_merchant_id (merchant_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_payment_method (payment_method)
);

CREATE TABLE payment_methods (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    payment_type VARCHAR(50) NOT NULL, -- 'credit_card', 'digital_wallet', 'bank_account'
    payment_data JSONB NOT NULL, -- encrypted payment details
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer_id (customer_id),
    INDEX idx_payment_type (payment_type)
);

CREATE TABLE settlements (
    id BIGSERIAL PRIMARY KEY,
    merchant_id BIGINT NOT NULL,
    settlement_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    transaction_count INTEGER NOT NULL,
    fee_amount DECIMAL(15,2) NOT NULL,
    net_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    settlement_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    INDEX idx_merchant_id (merchant_id),
    INDEX idx_settlement_date (settlement_date),
    INDEX idx_status (status)
);
```

## 🔧 **Detailed Component Design**

### 💳 **Payment Gateway**
```python
class PaymentGateway:
    def __init__(self, fraud_detector, risk_assessor, payment_router, 
                 cache_client, event_stream):
        self.fraud_detector = fraud_detector
        self.risk_assessor = risk_assessor
        self.payment_router = payment_router
        self.cache = cache_client
        self.event_stream = event_stream
    
    def process_payment(self, payment_request):
        """Process payment request"""
        # Create transaction record
        transaction = self.create_transaction(payment_request)
        
        # Fraud detection
        fraud_result = self.fraud_detector.analyze(transaction)
        if fraud_result['risk_level'] == 'high':
            return self.reject_transaction(transaction, 'fraud_detected')
        
        # Risk assessment
        risk_result = self.risk_assessor.assess(transaction)
        transaction.risk_level = risk_result['risk_level']
        transaction.fraud_score = fraud_result['score']
        
        # Route to appropriate processor
        processor_result = self.payment_router.route_and_process(transaction)
        
        # Update transaction status
        if processor_result['success']:
            transaction.status = 'authorized'
            transaction.processor_transaction_id = processor_result['processor_id']
            transaction.authorized_at = datetime.now()
            
            # Publish event
            self.event_stream.publish('payment_authorized', {
                'transaction_id': transaction.transaction_id,
                'merchant_id': transaction.merchant_id,
                'amount': str(transaction.amount),
                'currency': transaction.currency,
                'timestamp': transaction.authorized_at.isoformat()
            })
        else:
            transaction.status = 'failed'
            transaction.processor_response = processor_result['error']
        
        self.db.session.commit()
        return processor_result
    
    def capture_payment(self, transaction_id, amount=None):
        """Capture authorized payment"""
        transaction = self.get_transaction(transaction_id)
        
        if transaction.status != 'authorized':
            raise ValueError('Transaction not authorized')
        
        capture_amount = amount or transaction.amount
        
        # Capture via processor
        capture_result = self.payment_router.capture(transaction, capture_amount)
        
        if capture_result['success']:
            transaction.status = 'captured'
            transaction.captured_at = datetime.now()
            self.db.session.commit()
            
            # Publish event
            self.event_stream.publish('payment_captured', {
                'transaction_id': transaction.transaction_id,
                'amount': str(capture_amount),
                'timestamp': transaction.captured_at.isoformat()
            })
        
        return capture_result
```

### 🛡️ **Fraud Detection Service**
```python
class FraudDetectionService:
    def __init__(self, ml_model, rules_engine, cache_client):
        self.ml_model = ml_model
        self.rules_engine = rules_engine
        self.cache = cache_client
    
    def analyze(self, transaction):
        """Analyze transaction for fraud"""
        # Get historical data
        customer_history = self.get_customer_history(transaction.customer_id)
        merchant_history = self.get_merchant_history(transaction.merchant_id)
        
        # Feature extraction
        features = self.extract_features(transaction, customer_history, merchant_history)
        
        # ML model prediction
        ml_score = self.ml_model.predict(features)
        
        # Rules engine check
        rules_result = self.rules_engine.evaluate(transaction)
        
        # Combine scores
        final_score = self.combine_scores(ml_score, rules_result['score'])
        
        # Determine risk level
        risk_level = self.determine_risk_level(final_score)
        
        return {
            'score': final_score,
            'risk_level': risk_level,
            'ml_score': ml_score,
            'rules_violations': rules_result['violations'],
            'recommendation': 'approve' if risk_level != 'high' else 'reject'
        }
    
    def extract_features(self, transaction, customer_history, merchant_history):
        """Extract features for ML model"""
        return {
            'amount': float(transaction.amount),
            'currency': transaction.currency,
            'payment_method': transaction.payment_method,
            'customer_age_days': customer_history['account_age_days'],
            'customer_transaction_count': customer_history['total_transactions'],
            'customer_avg_amount': customer_history['avg_transaction_amount'],
            'merchant_risk_score': merchant_history['risk_score'],
            'time_of_day': transaction.created_at.hour,
            'day_of_week': transaction.created_at.weekday(),
            'is_new_customer': customer_history['is_new_customer'],
            'is_high_value': float(transaction.amount) > 1000,
            'is_international': transaction.currency != 'USD'
        }
```

### 🔄 **Payment Router**
```python
class PaymentRouter:
    def __init__(self, processor_configs, cache_client):
        self.processors = self.initialize_processors(processor_configs)
        self.cache = cache_client
    
    def route_and_process(self, transaction):
        """Route transaction to appropriate processor"""
        # Select processor based on payment method and region
        processor = self.select_processor(transaction)
        
        # Check processor availability
        if not self.is_processor_available(processor):
            processor = self.get_fallback_processor(transaction)
        
        # Process payment
        try:
            result = processor.process(transaction)
            return {
                'success': True,
                'processor_id': result['transaction_id'],
                'processor': processor.name,
                'response': result
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'processor': processor.name
            }
    
    def select_processor(self, transaction):
        """Select best processor for transaction"""
        # Get processor preferences for merchant
        merchant_preferences = self.get_merchant_preferences(transaction.merchant_id)
        
        # Get available processors for payment method
        available_processors = self.get_available_processors(transaction.payment_method)
        
        # Score processors based on cost, speed, reliability
        processor_scores = {}
        for processor in available_processors:
            score = self.calculate_processor_score(processor, transaction, merchant_preferences)
            processor_scores[processor] = score
        
        # Return best processor
        return max(processor_scores, key=processor_scores.get)
    
    def calculate_processor_score(self, processor, transaction, merchant_preferences):
        """Calculate processor score"""
        base_score = 100
        
        # Cost factor
        cost = processor.get_processing_cost(transaction)
        cost_score = max(0, 100 - (cost * 10))
        
        # Speed factor
        speed_score = processor.get_processing_speed_score()
        
        # Reliability factor
        reliability_score = processor.get_reliability_score()
        
        # Merchant preference factor
        preference_score = 100 if processor.name in merchant_preferences else 50
        
        return (base_score + cost_score + speed_score + reliability_score + preference_score) / 5
```

## ⚡ **Performance Optimization**

### 🗄️ **Caching Strategy**
```
Cache Layers:
1. Transaction Cache (Redis):
   - Recent transactions: TTL 1 hour
   - Transaction status: TTL 30 minutes
   - Payment method data: TTL 1 hour

2. Fraud Detection Cache (Redis):
   - Customer risk scores: TTL 1 hour
   - Merchant risk scores: TTL 1 hour
   - Blacklisted IPs/cards: TTL 24 hours

3. Processor Cache (Redis):
   - Processor availability: TTL 5 minutes
   - Processing costs: TTL 1 hour
   - Rate limits: TTL 1 minute
```

### 📊 **Database Optimization**
```
Indexing Strategy:
- Primary key on transaction ID for fast lookups
- Composite indexes for reporting queries
- Partial indexes for active transactions
- Partitioning by date for historical data

Sharding Strategy:
- Shard transactions by merchant_id
- Shard settlements by date
- Use read replicas for reporting
```

## 🔒 **Security Considerations**

### 🛡️ **PCI DSS Compliance**
```python
class SecurityManager:
    def __init__(self, encryption_service, tokenization_service):
        self.encryption = encryption_service
        self.tokenization = tokenization_service
    
    def secure_payment_data(self, payment_data):
        """Secure sensitive payment data"""
        # Tokenize card number
        token = self.tokenization.tokenize(payment_data['card_number'])
        
        # Encrypt sensitive data
        encrypted_data = {
            'card_number': token,
            'cvv': self.encryption.encrypt(payment_data['cvv']),
            'expiry_date': self.encryption.encrypt(payment_data['expiry_date'])
        }
        
        return encrypted_data
    
    def validate_pci_compliance(self, transaction):
        """Validate PCI DSS compliance"""
        checks = [
            self.check_data_encryption(transaction),
            self.check_access_logs(transaction),
            self.check_network_security(transaction),
            self.check_vulnerability_management(transaction)
        ]
        
        return all(checks)
```

## 📈 **Scalability Strategies**

### 🔄 **Horizontal Scaling**
```
Service Scaling:
- Stateless payment gateway instances
- Processor-specific service scaling
- Fraud detection with ML model serving
- Database read replicas for reporting

Load Distribution:
- Geographic load balancing
- Payment method-specific routing
- Merchant-specific processor preferences
- Circuit breaker pattern for processors
```

## 🚨 **Monitoring & Alerting**

### 📊 **Key Metrics**
```
Business Metrics:
- Transaction volume and value
- Success rates by payment method
- Fraud detection accuracy
- Settlement times and reconciliation

Technical Metrics:
- Payment processing latency
- Processor availability and performance
- Database query performance
- Cache hit rates and memory usage
```

## 🧪 **Testing Strategy**

### 🔬 **Testing Approaches**
```
Unit Testing:
- Payment processing logic
- Fraud detection algorithms
- Risk assessment models
- Security validations

Integration Testing:
- Processor integrations
- Database operations
- Event streaming
- Webhook delivery

Load Testing:
- High-volume transaction processing
- Concurrent payment requests
- Database performance under load
- Cache performance and eviction
```

---

**This payment system design provides a secure, scalable platform for processing millions of transactions with comprehensive fraud detection, compliance, and financial reporting capabilities.** 