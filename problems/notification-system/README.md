# 🔔 Notification System Design

> **Design a scalable notification system that can handle millions of notifications across multiple channels (email, SMS, push, in-app).**

## 📋 **Problem Statement**

Design a notification system that can:
- Send notifications across multiple channels (email, SMS, push, in-app)
- Handle millions of notifications per day
- Support real-time and batch notifications
- Provide personalization and targeting
- Track delivery and engagement metrics
- Support A/B testing and optimization
- Handle notification preferences and opt-outs

## 🎯 **Requirements**

### ✅ **Functional Requirements**
- **Multi-channel Delivery**: Email, SMS, push notifications, in-app
- **Notification Types**: Transactional, marketing, alerts, reminders
- **Personalization**: User preferences, dynamic content, localization
- **Scheduling**: Immediate, scheduled, recurring notifications
- **Templates**: Reusable notification templates with variables
- **Tracking**: Delivery status, open rates, click-through rates
- **A/B Testing**: Test different content and timing
- **Opt-out Management**: Respect user preferences and regulations

### 📊 **Non-Functional Requirements**
- **Scale**: Handle 100M+ notifications per day
- **Performance**: < 100ms for real-time notifications
- **Availability**: 99.99% uptime
- **Reliability**: Guaranteed delivery with retry mechanisms
- **Compliance**: GDPR, CAN-SPAM, TCPA compliance

## 📈 **Scale Estimation**

### 🚀 **Traffic Estimation**
```
Daily Active Users (DAU): 50M
Notifications per user per day: 10
Total notifications per day: 500M
Real-time notifications: 100M (20%)
Batch notifications: 400M (80%)
Email notifications: 300M (60%)
SMS notifications: 50M (10%)
Push notifications: 150M (30%)
Storage for notifications: 500M * 2KB = 1TB per day
```

## 🏗️ **High-Level Architecture**

### 📊 **System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   Mobile App    │    │   API Client    │
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
                    │  Notification Service     │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│  Email Service    │  │   SMS Service     │  │  Push Service     │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
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

### 📊 **Notifications Table (PostgreSQL)**
```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'push', 'in_app'
    template_id VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_at (scheduled_at),
    INDEX idx_notification_type (notification_type)
);

CREATE TABLE notification_templates (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    subject_template TEXT,
    content_template TEXT NOT NULL,
    variables JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_preferences (
    user_id BIGINT PRIMARY KEY,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT TRUE,
    marketing_sms BOOLEAN DEFAULT FALSE,
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '08:00',
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 **Detailed Component Design**

### 🔔 **Notification Service**
```python
class NotificationService:
    def __init__(self, db_connection, cache_client, event_stream, 
                 email_service, sms_service, push_service):
        self.db = db_connection
        self.cache = cache_client
        self.event_stream = event_stream
        self.email_service = email_service
        self.sms_service = sms_service
        self.push_service = push_service
    
    def send_notification(self, user_id, template_id, variables=None, 
                         channels=None, scheduled_at=None):
        """Send notification to user"""
        # Get user preferences
        preferences = self.get_user_preferences(user_id)
        
        # Determine channels to use
        if channels is None:
            channels = self.get_available_channels(preferences)
        
        notifications = []
        
        for channel in channels:
            # Check if user has opted out
            if not self.is_channel_enabled(preferences, channel):
                continue
            
            # Check quiet hours
            if self.is_in_quiet_hours(preferences):
                continue
            
            # Create notification record
            notification = self.create_notification_record(
                user_id, template_id, channel, variables, scheduled_at
            )
            
            notifications.append(notification)
            
            # Send immediately or schedule
            if scheduled_at is None:
                self.send_immediate_notification(notification)
            else:
                self.schedule_notification(notification, scheduled_at)
        
        return notifications
    
    def send_immediate_notification(self, notification):
        """Send notification immediately"""
        try:
            if notification.notification_type == 'email':
                result = self.email_service.send(notification)
            elif notification.notification_type == 'sms':
                result = self.sms_service.send(notification)
            elif notification.notification_type == 'push':
                result = self.push_service.send(notification)
            
            # Update status
            notification.status = 'sent'
            notification.sent_at = datetime.now()
            self.db.session.commit()
            
            # Publish event
            self.event_stream.publish('notification_sent', {
                'notification_id': notification.id,
                'user_id': notification.user_id,
                'channel': notification.notification_type,
                'timestamp': notification.sent_at.isoformat()
            })
            
        except Exception as e:
            notification.status = 'failed'
            notification.retry_count += 1
            self.db.session.commit()
            
            # Retry if under max retries
            if notification.retry_count < notification.max_retries:
                self.schedule_retry(notification)
```

### 📧 **Email Service**
```python
class EmailService:
    def __init__(self, smtp_config, template_engine):
        self.smtp_config = smtp_config
        self.template_engine = template_engine
    
    def send(self, notification):
        """Send email notification"""
        # Get template
        template = self.get_template(notification.template_id)
        
        # Render content
        subject = self.template_engine.render(
            template.subject_template, 
            notification.variables
        )
        content = self.template_engine.render(
            template.content_template, 
            notification.variables
        )
        
        # Build email
        email = {
            'to': notification.recipient,
            'subject': subject,
            'html': content,
            'from': self.smtp_config['from_address']
        }
        
        # Send via SMTP
        with smtplib.SMTP(self.smtp_config['host'], self.smtp_config['port']) as server:
            server.starttls()
            server.login(self.smtp_config['username'], self.smtp_config['password'])
            server.send_message(email)
        
        return {'status': 'sent', 'message_id': f"email_{notification.id}"}
```

### 📱 **Push Notification Service**
```python
class PushNotificationService:
    def __init__(self, fcm_config, apns_config):
        self.fcm_client = firebase_admin.initialize_app(fcm_config)
        self.apns_client = apns_config
    
    def send(self, notification):
        """Send push notification"""
        # Get user's push tokens
        push_tokens = self.get_user_push_tokens(notification.user_id)
        
        results = []
        
        for token in push_tokens:
            if token.platform == 'android':
                result = self.send_fcm_notification(token.token, notification)
            elif token.platform == 'ios':
                result = self.send_apns_notification(token.token, notification)
            
            results.append(result)
        
        return results
    
    def send_fcm_notification(self, token, notification):
        """Send FCM notification to Android"""
        message = messaging.Message(
            notification=messaging.Notification(
                title=notification.subject,
                body=notification.content
            ),
            token=token,
            data={
                'notification_id': str(notification.id),
                'type': notification.notification_type
            }
        )
        
        response = messaging.send(message)
        return {'status': 'sent', 'message_id': response}
```

## ⚡ **Performance Optimization**

### 🗄️ **Caching Strategy**
```
Cache Layers:
1. Template Cache (Redis):
   - Notification templates: TTL 1 hour
   - User preferences: TTL 30 minutes
   - Channel configurations: TTL 1 hour

2. Rate Limiting Cache (Redis):
   - User notification limits: TTL 1 hour
   - Channel rate limits: TTL 1 minute
   - Spam prevention: TTL 24 hours

3. Delivery Status Cache (Redis):
   - Recent delivery status: TTL 1 hour
   - Bounce lists: TTL 24 hours
   - Opt-out lists: TTL 1 hour
```

### 📊 **Queue Management**
```
Queue Strategy:
1. High Priority Queue:
   - Transactional notifications
   - Security alerts
   - Account notifications

2. Standard Queue:
   - Marketing notifications
   - Promotional content
   - General updates

3. Batch Queue:
   - Scheduled notifications
   - Bulk campaigns
   - Analytics reports
```

## 🔒 **Security Considerations**

### 🛡️ **Compliance & Privacy**
```python
class ComplianceManager:
    def __init__(self):
        self.gdpr_manager = GDPRManager()
        self.spam_detector = SpamDetector()
    
    def check_compliance(self, notification):
        """Check notification compliance"""
        checks = [
            self.check_gdpr_compliance(notification),
            self.check_spam_compliance(notification),
            self.check_opt_out_status(notification)
        ]
        
        if not all(checks):
            return {'compliant': False, 'reason': 'Compliance check failed'}
        
        return {'compliant': True}
    
    def check_opt_out_status(self, notification):
        """Check if user has opted out"""
        opt_out_key = f"opt_out:{notification.user_id}:{notification.notification_type}"
        return not self.cache.exists(opt_out_key)
```

## 📈 **Scalability Strategies**

### 🔄 **Horizontal Scaling**
```
Service Scaling:
- Stateless notification service instances
- Channel-specific service scaling
- Queue workers for batch processing
- Database read replicas for analytics

Load Distribution:
- Round-robin load balancing
- Channel-specific routing
- Geographic distribution for latency
- Priority-based queuing
```

## 🚨 **Monitoring & Alerting**

### 📊 **Key Metrics**
```
Business Metrics:
- Notifications sent per day
- Delivery rates by channel
- Open rates and click-through rates
- Opt-out rates and complaints

Technical Metrics:
- Queue depth and processing time
- Channel-specific delivery times
- Error rates and retry counts
- Template rendering performance
```

## 🧪 **Testing Strategy**

### 🔬 **Testing Approaches**
```
Unit Testing:
- Template rendering
- Channel-specific logic
- Compliance checks
- Rate limiting

Integration Testing:
- End-to-end notification flow
- Channel provider integration
- Database operations
- Event streaming

Load Testing:
- High-volume notification sending
- Queue processing under load
- Database performance
- Cache hit rates
```

---

**This notification system design provides a scalable, reliable platform for multi-channel communication with comprehensive tracking, personalization, and compliance features.** 