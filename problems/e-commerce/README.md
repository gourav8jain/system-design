# 🛒 E-commerce System Design

> **Design a scalable e-commerce platform like Amazon that can handle millions of products, orders, and users with real-time inventory management and personalized recommendations.**

## 📋 **Problem Statement**

Design an e-commerce platform that can:
- Handle millions of products and categories
- Process thousands of orders per minute
- Manage real-time inventory across warehouses
- Provide personalized product recommendations
- Support multiple payment methods and currencies
- Handle complex shipping and logistics
- Provide comprehensive analytics and reporting
- Support seller marketplace functionality

## 🎯 **Requirements**

### ✅ **Functional Requirements**
- **Product Management**: Product catalog, categories, variants, pricing
- **User Management**: Customer accounts, seller accounts, authentication
- **Shopping Experience**: Search, browse, cart, wishlist, reviews
- **Order Management**: Checkout, payment, order tracking, returns
- **Inventory Management**: Real-time stock tracking, warehouse management
- **Recommendations**: Personalized product suggestions, related items
- **Seller Platform**: Seller onboarding, product listing, commission management
- **Analytics**: Sales reports, customer insights, performance metrics

### 📊 **Non-Functional Requirements**
- **Scale**: Handle 10M+ products and 1M+ orders per day
- **Performance**: < 200ms page load times
- **Availability**: 99.9% uptime
- **Real-time**: Live inventory updates and pricing
- **Global**: Multi-region support with local currencies
- **Security**: PCI DSS compliance for payments

## 📈 **Scale Estimation**

### 🚀 **Traffic Estimation**
```
Daily Active Users (DAU): 50M
Products in catalog: 100M+
Orders per day: 1M
Products viewed per day: 500M
Search queries per day: 100M
Payment transactions per day: 1M
Storage for products: 100M * 5KB = 500GB
Storage for orders: 1M * 10KB = 10GB per day
Storage for user data: 50M * 2KB = 100GB
```

## 🏗️ **High-Level Architecture**

### 📊 **System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   Mobile App    │    │   Seller Portal  │
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
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│  Product Service  │  │   Order Service   │  │  User Service     │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Search & Recommendation │
                    │         Service           │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Inventory Service       │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Payment Gateway         │
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

### 📊 **Products Table (PostgreSQL)**
```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    product_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT REFERENCES categories(id),
    brand VARCHAR(100),
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    weight DECIMAL(8,2),
    dimensions JSONB, -- {length, width, height}
    images TEXT[],
    attributes JSONB, -- {color, size, material, etc.}
    seller_id BIGINT REFERENCES sellers(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_category_id (category_id),
    INDEX idx_seller_id (seller_id),
    INDEX idx_price (price),
    INDEX idx_rating (rating),
    INDEX idx_is_active (is_active)
);

CREATE TABLE product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id),
    variant_sku VARCHAR(100) UNIQUE,
    variant_name VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    attributes JSONB, -- {color: 'red', size: 'L'}
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_variant_sku (variant_sku)
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id BIGINT REFERENCES categories(id),
    level INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_parent_id (parent_id),
    INDEX idx_level (level)
);
```

### 📦 **Orders Table (PostgreSQL)**
```sql
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(100) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
    total_amount DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    shipping_address JSONB,
    billing_address JSONB,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    shipping_method VARCHAR(50),
    tracking_number VARCHAR(100),
    estimated_delivery DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    variant_id BIGINT REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);
```

### 🏪 **Inventory Table (PostgreSQL)**
```sql
CREATE TABLE inventory (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    variant_id BIGINT REFERENCES product_variants(id),
    warehouse_id BIGINT NOT NULL REFERENCES warehouses(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    reorder_point INTEGER DEFAULT 10,
    max_stock INTEGER,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, variant_id, warehouse_id),
    INDEX idx_product_id (product_id),
    INDEX idx_warehouse_id (warehouse_id),
    INDEX idx_available_quantity (available_quantity)
);

CREATE TABLE warehouses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address JSONB,
    country VARCHAR(3) NOT NULL,
    region VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 **Detailed Component Design**

### 🛍️ **Product Service**
```python
class ProductService:
    def __init__(self, db_connection, cache_client, search_client, event_stream):
        self.db = db_connection
        self.cache = cache_client
        self.search = search_client
        self.event_stream = event_stream
    
    def get_product(self, product_id, user_id=None):
        """Get product details with caching"""
        # Try cache first
        cache_key = f"product:{product_id}"
        cached_product = self.cache.get(cache_key)
        
        if cached_product:
            product_data = json.loads(cached_product)
        else:
            # Query database
            product = self.db.session.query(Product).filter_by(
                product_id=product_id,
                is_active=True
            ).first()
            
            if not product:
                raise NotFound("Product not found")
            
            # Get variants and inventory
            variants = self.get_product_variants(product.id)
            inventory = self.get_product_inventory(product.id)
            
            product_data = {
                'id': product.product_id,
                'name': product.name,
                'description': product.description,
                'price': float(product.price),
                'sale_price': float(product.sale_price) if product.sale_price else None,
                'rating': float(product.rating),
                'review_count': product.review_count,
                'images': product.images,
                'attributes': product.attributes,
                'variants': variants,
                'inventory': inventory
            }
            
            # Cache for 1 hour
            self.cache.set(cache_key, json.dumps(product_data), ttl=3600)
        
        # Track view if user is authenticated
        if user_id:
            self.track_product_view(product_id, user_id)
        
        return product_data
    
    def search_products(self, query, filters=None, sort_by='relevance', page=1, limit=20):
        """Search products using Elasticsearch"""
        # Build search query
        search_body = {
            "query": {
                "bool": {
                    "must": [
                        {"multi_match": {
                            "query": query,
                            "fields": ["name^3", "description^2", "brand", "category"]
                        }}
                    ],
                    "filter": [
                        {"term": {"is_active": True}}
                    ]
                }
            },
            "sort": self.get_sort_config(sort_by),
            "from": (page - 1) * limit,
            "size": limit
        }
        
        # Add filters
        if filters:
            if filters.get('category_id'):
                search_body["query"]["bool"]["filter"].append(
                    {"term": {"category_id": filters['category_id']}}
                )
            if filters.get('price_range'):
                search_body["query"]["bool"]["filter"].append(
                    {"range": {"price": filters['price_range']}}
                )
            if filters.get('brand'):
                search_body["query"]["bool"]["filter"].append(
                    {"term": {"brand": filters['brand']}}
                )
        
        # Execute search
        results = self.search.search(index="products", body=search_body)
        
        return {
            'products': [hit['_source'] for hit in results['hits']['hits']],
            'total': results['hits']['total']['value'],
            'page': page,
            'limit': limit
        }
    
    def get_recommendations(self, user_id, product_id=None, limit=10):
        """Get personalized product recommendations"""
        if product_id:
            # Product-based recommendations
            recommendations = self.get_product_based_recommendations(product_id, limit)
        else:
            # User-based recommendations
            recommendations = self.get_user_based_recommendations(user_id, limit)
        
        return recommendations
```

### 📦 **Order Service**
```python
class OrderService:
    def __init__(self, db_connection, inventory_service, payment_service, 
                 notification_service, event_stream):
        self.db = db_connection
        self.inventory = inventory_service
        self.payment = payment_service
        self.notification = notification_service
        self.event_stream = event_stream
    
    def create_order(self, customer_id, items, shipping_address, 
                    billing_address, payment_method):
        """Create a new order"""
        # Validate items and check inventory
        validated_items = []
        total_amount = 0
        
        for item in items:
            # Check inventory
            available = self.inventory.check_availability(
                item['product_id'], 
                item.get('variant_id'), 
                item['quantity']
            )
            
            if not available:
                raise InsufficientStock(f"Insufficient stock for product {item['product_id']}")
            
            # Get product details
            product = self.get_product(item['product_id'])
            price = product['sale_price'] or product['price']
            item_total = price * item['quantity']
            
            validated_items.append({
                **item,
                'unit_price': price,
                'total_price': item_total
            })
            
            total_amount += item_total
        
        # Calculate taxes and shipping
        tax_amount = self.calculate_tax(total_amount, shipping_address)
        shipping_amount = self.calculate_shipping(validated_items, shipping_address)
        
        # Create order
        order = Order(
            order_id=self.generate_order_id(),
            customer_id=customer_id,
            total_amount=total_amount,
            tax_amount=tax_amount,
            shipping_amount=shipping_amount,
            shipping_address=shipping_address,
            billing_address=billing_address,
            payment_method=payment_method
        )
        
        self.db.session.add(order)
        self.db.session.flush()
        
        # Create order items
        for item in validated_items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item['product_id'],
                variant_id=item.get('variant_id'),
                quantity=item['quantity'],
                unit_price=item['unit_price'],
                total_price=item['total_price']
            )
            self.db.session.add(order_item)
        
        self.db.session.commit()
        
        # Reserve inventory
        for item in validated_items:
            self.inventory.reserve_stock(
                item['product_id'],
                item.get('variant_id'),
                item['quantity']
            )
        
        # Publish event
        self.event_stream.publish('order_created', {
            'order_id': order.order_id,
            'customer_id': customer_id,
            'total_amount': str(total_amount),
            'timestamp': order.created_at.isoformat()
        })
        
        return order
    
    def process_payment(self, order_id, payment_data):
        """Process payment for order"""
        order = self.get_order(order_id)
        
        if order.payment_status == 'completed':
            raise ValueError('Payment already processed')
        
        # Process payment
        payment_result = self.payment.process_payment(payment_data, order)
        
        if payment_result['success']:
            order.payment_status = 'completed'
            order.status = 'confirmed'
            self.db.session.commit()
            
            # Send confirmation notification
            self.notification.send_order_confirmation(order.customer_id, order.order_id)
            
            # Publish event
            self.event_stream.publish('payment_processed', {
                'order_id': order.order_id,
                'amount': str(order.total_amount),
                'timestamp': datetime.now().isoformat()
            })
        else:
            order.payment_status = 'failed'
            self.db.session.commit()
            
            # Release reserved inventory
            self.release_reserved_inventory(order.id)
        
        return payment_result
```

### 📊 **Inventory Service**
```python
class InventoryService:
    def __init__(self, db_connection, cache_client, event_stream):
        self.db = db_connection
        self.cache = cache_client
        self.event_stream = event_stream
    
    def check_availability(self, product_id, variant_id=None, quantity=1):
        """Check if product is available in requested quantity"""
        cache_key = f"inventory:{product_id}:{variant_id or 'default'}"
        cached_inventory = self.cache.get(cache_key)
        
        if cached_inventory:
            available_quantity = int(cached_inventory)
        else:
            # Query database
            query = self.db.session.query(Inventory).filter_by(
                product_id=product_id,
                variant_id=variant_id
            )
            
            if variant_id is None:
                query = query.filter(Inventory.variant_id.is_(None))
            
            inventory = query.first()
            available_quantity = inventory.available_quantity if inventory else 0
            
            # Cache for 5 minutes
            self.cache.set(cache_key, str(available_quantity), ttl=300)
        
        return available_quantity >= quantity
    
    def reserve_stock(self, product_id, variant_id=None, quantity=1):
        """Reserve stock for order"""
        # Use database transaction for consistency
        with self.db.session.begin():
            inventory = self.db.session.query(Inventory).filter_by(
                product_id=product_id,
                variant_id=variant_id
            ).with_for_update().first()
            
            if not inventory or inventory.available_quantity < quantity:
                raise InsufficientStock("Insufficient stock")
            
            inventory.reserved_quantity += quantity
            self.db.session.commit()
            
            # Update cache
            cache_key = f"inventory:{product_id}:{variant_id or 'default'}"
            self.cache.set(cache_key, str(inventory.available_quantity), ttl=300)
            
            # Publish event
            self.event_stream.publish('inventory_reserved', {
                'product_id': product_id,
                'variant_id': variant_id,
                'quantity': quantity,
                'timestamp': datetime.now().isoformat()
            })
    
    def update_stock(self, product_id, variant_id=None, quantity_change=0):
        """Update stock quantity (for receiving shipments)"""
        inventory = self.db.session.query(Inventory).filter_by(
            product_id=product_id,
            variant_id=variant_id
        ).first()
        
        if inventory:
            inventory.quantity += quantity_change
            inventory.last_updated = datetime.now()
            self.db.session.commit()
            
            # Update cache
            cache_key = f"inventory:{product_id}:{variant_id or 'default'}"
            self.cache.set(cache_key, str(inventory.available_quantity), ttl=300)
            
            # Publish event
            self.event_stream.publish('inventory_updated', {
                'product_id': product_id,
                'variant_id': variant_id,
                'quantity_change': quantity_change,
                'new_quantity': inventory.quantity,
                'timestamp': datetime.now().isoformat()
            })
```

## ⚡ **Performance Optimization**

### 🗄️ **Caching Strategy**
```
Cache Layers:
1. Product Cache (Redis):
   - Product details: TTL 1 hour
   - Product variants: TTL 1 hour
   - Category data: TTL 2 hours
   - Search results: TTL 15 minutes

2. Inventory Cache (Redis):
   - Stock levels: TTL 5 minutes
   - Reserved quantities: TTL 1 minute
   - Warehouse data: TTL 1 hour

3. User Cache (Redis):
   - User preferences: TTL 30 minutes
   - Shopping cart: TTL 1 hour
   - Order history: TTL 1 hour

4. CDN Cache:
   - Product images and media
   - Static assets
   - Geographic distribution
```

### 📊 **Database Optimization**
```
Indexing Strategy:
- Primary keys on product_id and order_id
- Composite indexes for search queries
- Partial indexes for active products
- Partitioning by date for orders

Sharding Strategy:
- Shard products by category_id
- Shard orders by customer_id
- Shard inventory by warehouse_id
- Use read replicas for analytics
```

## 🔒 **Security Considerations**

### 🛡️ **Payment Security**
```python
class PaymentSecurity:
    def __init__(self, encryption_service, fraud_detector):
        self.encryption = encryption_service
        self.fraud_detector = fraud_detector
    
    def secure_payment_data(self, payment_data):
        """Secure sensitive payment information"""
        # Encrypt card data
        encrypted_data = {
            'card_number': self.encryption.encrypt(payment_data['card_number']),
            'cvv': self.encryption.encrypt(payment_data['cvv']),
            'expiry_date': self.encryption.encrypt(payment_data['expiry_date'])
        }
        
        return encrypted_data
    
    def validate_order(self, order_data, user_id):
        """Validate order for fraud"""
        # Check for suspicious patterns
        fraud_checks = [
            self.check_order_frequency(user_id),
            self.check_order_amount(order_data['total_amount']),
            self.check_shipping_billing_match(order_data),
            self.check_device_location(order_data)
        ]
        
        if any(fraud_checks):
            return {'valid': False, 'reason': 'Fraud detected'}
        
        return {'valid': True}
```

## 📈 **Scalability Strategies**

### 🔄 **Horizontal Scaling**
```
Service Scaling:
- Stateless product service instances
- Order processing with queue workers
- Inventory service with read replicas
- Search service with Elasticsearch cluster

Load Distribution:
- Geographic load balancing
- Category-based product routing
- Order processing by region
- Inventory management by warehouse
```

## 🚨 **Monitoring & Alerting**

### 📊 **Key Metrics**
```
Business Metrics:
- Daily/Monthly sales revenue
- Order conversion rates
- Average order value
- Customer lifetime value
- Product performance

Technical Metrics:
- Page load times
- Search response times
- Order processing latency
- Inventory accuracy
- Payment success rates
```

## 🧪 **Testing Strategy**

### 🔬 **Testing Approaches**
```
Unit Testing:
- Product search and filtering
- Order creation and validation
- Inventory management
- Payment processing

Integration Testing:
- End-to-end order flow
- Payment gateway integration
- Inventory synchronization
- Search functionality

Load Testing:
- High-volume product browsing
- Concurrent order processing
- Search performance under load
- Inventory updates
```

---

**This e-commerce system design provides a comprehensive, scalable platform for online retail with real-time inventory management, personalized recommendations, and robust order processing capabilities.** 