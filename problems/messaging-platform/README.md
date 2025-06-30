# 💬 Messaging Platform System Design

> **Design a real-time messaging platform like WhatsApp that can handle millions of users, messages, and group chats with end-to-end encryption and global scalability.**

## 📋 **Problem Statement**

Design a messaging platform that can:
- Handle millions of concurrent users and real-time messages
- Support one-on-one and group messaging
- Provide end-to-end encryption for security
- Handle media sharing (photos, videos, documents)
- Support voice and video calls
- Provide message status (sent, delivered, read)
- Handle offline message delivery and synchronization
- Support multiple devices per user
- Provide message search and archiving

## 🎯 **Requirements**

### ✅ **Functional Requirements**
- **Real-time Messaging**: Instant message delivery
- **Group Chats**: Multi-participant conversations
- **Media Sharing**: Photos, videos, documents, voice messages
- **Voice/Video Calls**: Real-time communication
- **Message Status**: Sent, delivered, read receipts
- **Offline Support**: Message queuing and synchronization
- **Multi-device**: Support for multiple devices per user
- **Search**: Message and contact search
- **Privacy**: End-to-end encryption, disappearing messages
- **Notifications**: Push notifications for new messages

### 📊 **Non-Functional Requirements**
- **Scale**: Handle 1B+ users and 100B+ messages per day
- **Performance**: < 100ms message delivery
- **Availability**: 99.99% uptime
- **Security**: End-to-end encryption
- **Real-time**: Instant message delivery
- **Global**: Multi-region support with low latency

## 📈 **Scale Estimation**

### 🚀 **Traffic Estimation**
```
Daily Active Users (DAU): 1B
Messages per user per day: 50
Total messages per day: 50B
Group messages: 20B (40%)
One-on-one messages: 30B (60%)
Media messages: 10B (20%)
Voice/Video calls: 5B minutes per day
Storage for messages: 50B * 1KB = 50TB per day
Storage for media: 10B * 5MB = 50PB per day
```

## 🏗️ **High-Level Architecture**

### 📊 **System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web Client    │    │   Desktop App   │
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
│  Message Service  │  │  WebSocket Manager│  │  Media Service    │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Call Service            │
                    │   (Voice/Video)           │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Encryption Service      │
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

### 💬 **Messages Table (PostgreSQL)**
```sql
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    message_id VARCHAR(100) UNIQUE NOT NULL,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id),
    sender_id BIGINT NOT NULL REFERENCES users(id),
    message_type VARCHAR(20) NOT NULL, -- 'text', 'image', 'video', 'document', 'voice'
    content TEXT,
    media_url VARCHAR(500),
    media_metadata JSONB, -- {size, duration, dimensions, etc.}
    reply_to_message_id BIGINT REFERENCES messages(id),
    is_forwarded BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    encryption_key_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_message_id (message_id),
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_created_at (created_at)
);

CREATE TABLE conversations (
    id BIGSERIAL PRIMARY KEY,
    conversation_id VARCHAR(100) UNIQUE NOT NULL,
    conversation_type VARCHAR(20) NOT NULL, -- 'one_on_one', 'group'
    name VARCHAR(255), -- for group chats
    description TEXT, -- for group chats
    created_by BIGINT REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_conversation_type (conversation_type)
);

CREATE TABLE conversation_participants (
    conversation_id BIGINT NOT NULL REFERENCES conversations(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'member', -- 'admin', 'member'
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_read_message_id BIGINT REFERENCES messages(id),
    last_read_at TIMESTAMP,
    is_muted BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (conversation_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_last_read_at (last_read_at)
);

CREATE TABLE message_status (
    message_id BIGINT NOT NULL REFERENCES messages(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL, -- 'sent', 'delivered', 'read'
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);
```

### 👤 **Users and Devices Table (PostgreSQL)**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(100),
    profile_picture_url VARCHAR(500),
    status_message TEXT,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_phone_number (phone_number),
    INDEX idx_username (username)
);

CREATE TABLE user_devices (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    device_id VARCHAR(100) UNIQUE NOT NULL,
    device_type VARCHAR(20) NOT NULL, -- 'mobile', 'web', 'desktop'
    device_name VARCHAR(100),
    push_token VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_device_id (device_id)
);

CREATE TABLE user_contacts (
    user_id BIGINT NOT NULL REFERENCES users(id),
    contact_user_id BIGINT NOT NULL REFERENCES users(id),
    contact_name VARCHAR(100),
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, contact_user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_contact_user_id (contact_user_id)
);
```

### 🔐 **Encryption Table (PostgreSQL)**
```sql
CREATE TABLE encryption_keys (
    id BIGSERIAL PRIMARY KEY,
    key_id VARCHAR(100) UNIQUE NOT NULL,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id),
    public_key TEXT NOT NULL,
    encrypted_private_key TEXT NOT NULL,
    created_by BIGINT NOT NULL REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    INDEX idx_key_id (key_id),
    INDEX idx_conversation_id (conversation_id)
);

CREATE TABLE session_keys (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id),
    encrypted_session_key TEXT NOT NULL,
    created_by BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id),
    INDEX idx_conversation_id (conversation_id)
);
```

## 🔧 **Detailed Component Design**

### 💬 **Message Service**
```python
class MessageService:
    def __init__(self, db_connection, websocket_manager, encryption_service, 
                 cache_client, event_stream):
        self.db = db_connection
        self.websocket = websocket_manager
        self.encryption = encryption_service
        self.cache = cache_client
        self.event_stream = event_stream
    
    def send_message(self, sender_id, conversation_id, content, message_type='text', 
                    media_url=None, reply_to_message_id=None):
        """Send a message to a conversation"""
        # Generate message ID
        message_id = self.generate_message_id()
        
        # Encrypt message content
        encrypted_content = self.encryption.encrypt_message(content, conversation_id)
        
        # Create message record
        message = Message(
            message_id=message_id,
            conversation_id=conversation_id,
            sender_id=sender_id,
            message_type=message_type,
            content=encrypted_content,
            media_url=media_url,
            reply_to_message_id=reply_to_message_id
        )
        
        self.db.session.add(message)
        self.db.session.commit()
        
        # Get conversation participants
        participants = self.get_conversation_participants(conversation_id)
        
        # Send to online participants
        online_participants = []
        for participant in participants:
            if participant['user_id'] != sender_id:
                # Check if user is online
                if self.is_user_online(participant['user_id']):
                    self.send_to_user(participant['user_id'], message)
                    online_participants.append(participant['user_id'])
                else:
                    # Queue for offline delivery
                    self.queue_offline_message(participant['user_id'], message)
        
        # Update message status
        self.update_message_status(message.id, participants, 'sent')
        
        # Publish event
        self.event_stream.publish('message_sent', {
            'message_id': message_id,
            'conversation_id': conversation_id,
            'sender_id': sender_id,
            'online_participants': online_participants,
            'timestamp': message.created_at.isoformat()
        })
        
        return message
    
    def send_to_user(self, user_id, message):
        """Send message to specific user via WebSocket"""
        # Get user's active devices
        devices = self.get_user_active_devices(user_id)
        
        for device in devices:
            # Send via WebSocket
            self.websocket.send_to_device(device['device_id'], {
                'type': 'new_message',
                'message': self.serialize_message(message)
            })
    
    def mark_message_as_read(self, user_id, message_id):
        """Mark message as read by user"""
        # Update message status
        message_status = self.db.session.query(MessageStatus).filter_by(
            message_id=message_id,
            user_id=user_id
        ).first()
        
        if message_status and message_status.status != 'read':
            message_status.status = 'read'
            message_status.updated_at = datetime.now()
            self.db.session.commit()
            
            # Notify sender
            message = self.get_message(message_id)
            if message and message.sender_id != user_id:
                self.notify_message_read(message.sender_id, message_id, user_id)
    
    def get_conversation_messages(self, conversation_id, user_id, page=1, limit=50):
        """Get messages for a conversation"""
        # Check if user is participant
        if not self.is_conversation_participant(conversation_id, user_id):
            raise Unauthorized("Not a participant")
        
        # Get messages
        offset = (page - 1) * limit
        messages = self.db.session.query(Message).filter_by(
            conversation_id=conversation_id,
            is_deleted=False
        ).order_by(Message.created_at.desc()).offset(offset).limit(limit).all()
        
        # Decrypt messages
        decrypted_messages = []
        for message in messages:
            decrypted_content = self.encryption.decrypt_message(message.content, conversation_id)
            decrypted_messages.append({
                **message.__dict__,
                'content': decrypted_content
            })
        
        return decrypted_messages
```

### 🔌 **WebSocket Manager**
```python
class WebSocketManager:
    def __init__(self, redis_client, cache_client):
        self.redis = redis_client
        self.cache = cache_client
        self.connections = {}  # device_id -> websocket_connection
    
    def connect_user(self, user_id, device_id, websocket_connection):
        """Connect user device to WebSocket"""
        # Store connection
        self.connections[device_id] = websocket_connection
        
        # Update user status
        self.update_user_status(user_id, 'online')
        
        # Store device connection info
        connection_key = f"device_connection:{device_id}"
        self.redis.set(connection_key, user_id, ex=3600)  # 1 hour TTL
        
        # Send pending messages
        self.send_pending_messages(user_id, device_id)
    
    def disconnect_user(self, device_id):
        """Disconnect user device"""
        if device_id in self.connections:
            user_id = self.redis.get(f"device_connection:{device_id}")
            
            # Remove connection
            del self.connections[device_id]
            self.redis.delete(f"device_connection:{device_id}")
            
            # Check if user has other active devices
            if not self.has_active_devices(user_id):
                self.update_user_status(user_id, 'offline')
    
    def send_to_device(self, device_id, message):
        """Send message to specific device"""
        if device_id in self.connections:
            try:
                websocket = self.connections[device_id]
                websocket.send(json.dumps(message))
            except Exception as e:
                # Remove failed connection
                self.disconnect_user(device_id)
    
    def broadcast_to_conversation(self, conversation_id, message, exclude_user=None):
        """Broadcast message to all participants in conversation"""
        participants = self.get_conversation_participants(conversation_id)
        
        for participant in participants:
            if participant['user_id'] != exclude_user:
                devices = self.get_user_active_devices(participant['user_id'])
                
                for device in devices:
                    self.send_to_device(device['device_id'], message)
    
    def update_user_status(self, user_id, status):
        """Update user online/offline status"""
        status_key = f"user_status:{user_id}"
        self.redis.set(status_key, status, ex=300)  # 5 minutes TTL
        
        # Notify contacts about status change
        contacts = self.get_user_contacts(user_id)
        for contact in contacts:
            self.notify_status_change(contact['user_id'], user_id, status)
```

### 🔐 **Encryption Service**
```python
class EncryptionService:
    def __init__(self, key_management_service):
        self.key_management = key_management_service
    
    def encrypt_message(self, content, conversation_id):
        """Encrypt message content"""
        # Get session key for conversation
        session_key = self.key_management.get_session_key(conversation_id)
        
        # Encrypt content
        encrypted_content = self.encrypt_with_key(content, session_key)
        
        return encrypted_content
    
    def decrypt_message(self, encrypted_content, conversation_id):
        """Decrypt message content"""
        # Get session key for conversation
        session_key = self.key_management.get_session_key(conversation_id)
        
        # Decrypt content
        decrypted_content = self.decrypt_with_key(encrypted_content, session_key)
        
        return decrypted_content
    
    def setup_conversation_encryption(self, conversation_id, participants):
        """Setup encryption for new conversation"""
        # Generate encryption keys
        public_key, private_key = self.generate_key_pair()
        
        # Store public key
        self.key_management.store_public_key(conversation_id, public_key)
        
        # Encrypt private key for each participant
        for participant in participants:
            encrypted_private_key = self.encrypt_for_user(private_key, participant['user_id'])
            self.key_management.store_encrypted_private_key(
                conversation_id, participant['user_id'], encrypted_private_key
            )
        
        # Generate session key
        session_key = self.generate_session_key()
        self.key_management.store_session_key(conversation_id, session_key)
    
    def rotate_session_key(self, conversation_id):
        """Rotate session key for conversation"""
        # Generate new session key
        new_session_key = self.generate_session_key()
        
        # Store new session key
        self.key_management.store_session_key(conversation_id, new_session_key)
        
        # Notify participants about key rotation
        participants = self.get_conversation_participants(conversation_id)
        for participant in participants:
            self.notify_key_rotation(participant['user_id'], conversation_id)
```

### 📞 **Call Service**
```python
class CallService:
    def __init__(self, webrtc_service, notification_service):
        self.webrtc = webrtc_service
        self.notification = notification_service
    
    def initiate_call(self, caller_id, callee_id, call_type='voice'):
        """Initiate a call"""
        # Check if callee is available
        if not self.is_user_available(callee_id):
            return {'success': False, 'reason': 'User unavailable'}
        
        # Create call session
        call_session = self.create_call_session(caller_id, callee_id, call_type)
        
        # Send call invitation
        self.send_call_invitation(callee_id, call_session)
        
        return {'success': True, 'call_session_id': call_session['id']}
    
    def accept_call(self, call_session_id, user_id):
        """Accept incoming call"""
        call_session = self.get_call_session(call_session_id)
        
        if not call_session or call_session['callee_id'] != user_id:
            return {'success': False, 'reason': 'Invalid call session'}
        
        # Update call status
        self.update_call_status(call_session_id, 'accepted')
        
        # Establish WebRTC connection
        webrtc_connection = self.webrtc.establish_connection(call_session)
        
        return {'success': True, 'webrtc_connection': webrtc_connection}
    
    def reject_call(self, call_session_id, user_id):
        """Reject incoming call"""
        call_session = self.get_call_session(call_session_id)
        
        if call_session:
            # Update call status
            self.update_call_status(call_session_id, 'rejected')
            
            # Notify caller
            self.notify_call_rejected(call_session['caller_id'], call_session_id)
    
    def end_call(self, call_session_id, user_id):
        """End ongoing call"""
        call_session = self.get_call_session(call_session_id)
        
        if call_session:
            # Update call status
            self.update_call_status(call_session_id, 'ended')
            
            # Close WebRTC connection
            self.webrtc.close_connection(call_session_id)
            
            # Notify other participant
            other_user = (call_session['callee_id'] if user_id == call_session['caller_id'] 
                         else call_session['caller_id'])
            self.notify_call_ended(other_user, call_session_id)
```

## ⚡ **Performance Optimization**

### 🗄️ **Caching Strategy**
```
Cache Layers:
1. Message Cache (Redis):
   - Recent messages: TTL 1 hour
   - Conversation metadata: TTL 30 minutes
   - User status: TTL 5 minutes

2. WebSocket Cache (Redis):
   - Device connections: TTL 1 hour
   - User sessions: TTL 30 minutes
   - Connection mapping: TTL 1 hour

3. Encryption Cache (Redis):
   - Session keys: TTL 1 hour
   - Public keys: TTL 24 hours
   - Key rotation status: TTL 30 minutes

4. Offline Message Queue (Redis):
   - Pending messages: TTL 7 days
   - Delivery status: TTL 1 hour
   - Sync state: TTL 30 minutes
```

### 📊 **Database Optimization**
```
Indexing Strategy:
- Primary keys on message_id and conversation_id
- Composite indexes for conversation queries
- Partial indexes for active conversations
- Partitioning by date for messages

Sharding Strategy:
- Shard messages by conversation_id
- Shard users by user_id hash
- Use read replicas for message history
```

## 🔒 **Security Considerations**

### 🛡️ **End-to-End Encryption**
```python
class SecurityManager:
    def __init__(self, encryption_service, key_management):
        self.encryption = encryption_service
        self.key_management = key_management
    
    def verify_message_integrity(self, message_id, signature):
        """Verify message hasn't been tampered with"""
        # Get message content
        message = self.get_message(message_id)
        
        # Verify signature
        public_key = self.key_management.get_sender_public_key(message.sender_id)
        is_valid = self.encryption.verify_signature(message.content, signature, public_key)
        
        return is_valid
    
    def detect_man_in_middle(self, conversation_id, user_id):
        """Detect potential man-in-the-middle attacks"""
        # Check for key mismatches
        stored_key = self.key_management.get_session_key(conversation_id)
        user_key = self.key_management.get_user_session_key(conversation_id, user_id)
        
        if stored_key != user_key:
            return {'attack_detected': True, 'type': 'key_mismatch'}
        
        return {'attack_detected': False}
```

## 📈 **Scalability Strategies**

### 🔄 **Horizontal Scaling**
```
Service Scaling:
- Stateless message service instances
- WebSocket servers with load balancing
- Media service with CDN distribution
- Call service with WebRTC servers

Load Distribution:
- Geographic load balancing
- User-based sharding
- Conversation-based routing
- Device-specific connections
```

## 🚨 **Monitoring & Alerting**

### 📊 **Key Metrics**
```
Business Metrics:
- Daily active users
- Messages sent per day
- Group chat participation
- Call duration and quality
- Media sharing rates

Technical Metrics:
- Message delivery latency
- WebSocket connection stability
- Encryption/decryption performance
- Offline message sync success
- Call connection success rates
```

## 🧪 **Testing Strategy**

### 🔬 **Testing Approaches**
```
Unit Testing:
- Message encryption/decryption
- WebSocket connection management
- Call establishment
- Offline message handling

Integration Testing:
- End-to-end message delivery
- Multi-device synchronization
- Group chat functionality
- Call quality and reliability

Load Testing:
- High-concurrency messaging
- WebSocket connection limits
- Media upload/download
- Call capacity testing
```

---

**This messaging platform system design provides a comprehensive, secure, and scalable solution for real-time communication with end-to-end encryption and global reach.** 