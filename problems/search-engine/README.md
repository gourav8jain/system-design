# 🔍 Search Engine System Design

> **Design a search engine like Google that can crawl billions of web pages, build comprehensive indexes, and provide relevant search results with advanced ranking algorithms and real-time capabilities.**

## 📋 **Problem Statement**

Design a search engine that can:
- Crawl and index billions of web pages globally
- Process millions of search queries per second
- Provide relevant search results with sub-second response times
- Support multiple content types (web pages, images, videos, news)
- Handle real-time content updates and fresh indexing
- Implement advanced ranking algorithms (PageRank, ML-based ranking)
- Support personalized search and user preferences
- Provide autocomplete and search suggestions
- Handle spam detection and content quality filtering
- Support multiple languages and geolocation-based results

## 🎯 **Requirements**

### ✅ **Functional Requirements**
- **Web Crawling**: Automated discovery and crawling of web pages
- **Content Processing**: Text extraction, parsing, and metadata extraction
- **Indexing**: Building inverted indexes for fast text search
- **Search Processing**: Query parsing, expansion, and optimization
- **Ranking**: Relevance scoring and result ranking algorithms
- **Autocomplete**: Real-time search suggestions and query completion
- **Personalization**: User-specific search results and preferences
- **Analytics**: Search analytics, click tracking, and performance metrics
- **Spam Detection**: Content quality filtering and spam prevention
- **Multi-language**: Support for multiple languages and localization

### 📊 **Non-Functional Requirements**
- **Scale**: Handle 100B+ web pages and 10M+ queries per second
- **Performance**: < 200ms search response time
- **Availability**: 99.99% uptime
- **Freshness**: Index updates within minutes for important content
- **Accuracy**: High relevance and precision in search results
- **Global**: Multi-region support with local content prioritization

## 📈 **Scale Estimation**

### 🚀 **Traffic Estimation**
```
Web Pages Indexed: 100B+
Daily Crawl Volume: 1B+ pages
Search Queries per Day: 10B+
Peak Queries per Second: 10M+
Index Size: 100B * 10KB = 1PB
Storage for Crawl Data: 1B * 50KB = 50TB per day
Storage for Search Logs: 10B * 1KB = 10TB per day
```

## 🏗️ **High-Level Architecture**

### 📊 **System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   Mobile App    │    │   API Clients   │
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
│  Search Service   │  │  Crawler Service  │  │  Indexing Service │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│  Ranking Engine   │  │  Content Parser   │  │  Index Manager    │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│  Autocomplete     │  │  Spam Detection   │  │  Analytics        │
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

### 🌐 **Web Pages Table (PostgreSQL)**
```sql
CREATE TABLE web_pages (
    id BIGSERIAL PRIMARY KEY,
    url_hash VARCHAR(64) UNIQUE NOT NULL,
    url TEXT NOT NULL,
    domain VARCHAR(255) NOT NULL,
    title VARCHAR(500),
    meta_description TEXT,
    content_hash VARCHAR(64),
    content_type VARCHAR(50), -- 'html', 'pdf', 'image', 'video'
    language VARCHAR(10),
    encoding VARCHAR(20),
    content_length INTEGER,
    http_status_code INTEGER,
    last_crawled_at TIMESTAMP,
    last_modified_at TIMESTAMP,
    crawl_frequency INTEGER DEFAULT 86400, -- seconds
    is_active BOOLEAN DEFAULT TRUE,
    is_spam BOOLEAN DEFAULT FALSE,
    spam_score DECIMAL(3,2) DEFAULT 0,
    page_rank DECIMAL(10,8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_url_hash (url_hash),
    INDEX idx_domain (domain),
    INDEX idx_last_crawled_at (last_crawled_at),
    INDEX idx_is_active (is_active),
    INDEX idx_page_rank (page_rank),
    INDEX idx_language (language)
);

CREATE TABLE page_content (
    id BIGSERIAL PRIMARY KEY,
    page_id BIGINT NOT NULL REFERENCES web_pages(id),
    content_type VARCHAR(20) NOT NULL, -- 'title', 'body', 'headings', 'links'
    content_text TEXT,
    content_hash VARCHAR(64),
    word_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_page_id (page_id),
    INDEX idx_content_type (content_type),
    INDEX idx_content_hash (content_hash)
);

CREATE TABLE page_links (
    id BIGSERIAL PRIMARY KEY,
    source_page_id BIGINT NOT NULL REFERENCES web_pages(id),
    target_url TEXT NOT NULL,
    target_domain VARCHAR(255),
    anchor_text TEXT,
    link_type VARCHAR(20), -- 'internal', 'external', 'nofollow'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_source_page_id (source_page_id),
    INDEX idx_target_domain (target_domain),
    INDEX idx_link_type (link_type)
);
```

### 🔍 **Search Index Table (Elasticsearch)**
```json
{
  "mappings": {
    "properties": {
      "page_id": {"type": "long"},
      "url": {"type": "keyword"},
      "domain": {"type": "keyword"},
      "title": {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": {"type": "keyword"}
        }
      },
      "content": {
        "type": "text",
        "analyzer": "standard"
      },
      "meta_description": {
        "type": "text",
        "analyzer": "standard"
      },
      "headings": {
        "type": "text",
        "analyzer": "standard"
      },
      "keywords": {
        "type": "keyword"
      },
      "language": {"type": "keyword"},
      "content_type": {"type": "keyword"},
      "page_rank": {"type": "float"},
      "spam_score": {"type": "float"},
      "last_crawled_at": {"type": "date"},
      "domain_authority": {"type": "float"},
      "word_count": {"type": "integer"},
      "freshness_score": {"type": "float"}
    }
  }
}
```

### 📊 **Search Analytics Table (PostgreSQL)**
```sql
CREATE TABLE search_queries (
    id BIGSERIAL PRIMARY KEY,
    query_hash VARCHAR(64) NOT NULL,
    query_text TEXT NOT NULL,
    query_language VARCHAR(10),
    result_count INTEGER,
    avg_click_position DECIMAL(5,2),
    click_through_rate DECIMAL(5,4),
    search_volume INTEGER DEFAULT 1,
    first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_query_hash (query_hash),
    INDEX idx_query_text (query_text),
    INDEX idx_search_volume (search_volume)
);

CREATE TABLE search_clicks (
    id BIGSERIAL PRIMARY KEY,
    query_id BIGINT NOT NULL REFERENCES search_queries(id),
    page_id BIGINT NOT NULL REFERENCES web_pages(id),
    user_id VARCHAR(100),
    session_id VARCHAR(100),
    click_position INTEGER NOT NULL,
    dwell_time INTEGER, -- seconds
    is_bounce BOOLEAN DEFAULT FALSE,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_query_id (query_id),
    INDEX idx_page_id (page_id),
    INDEX idx_user_id (user_id),
    INDEX idx_clicked_at (clicked_at)
);

CREATE TABLE autocomplete_suggestions (
    id BIGSERIAL PRIMARY KEY,
    prefix VARCHAR(100) NOT NULL,
    suggestion TEXT NOT NULL,
    suggestion_type VARCHAR(20), -- 'query', 'url', 'entity'
    frequency INTEGER DEFAULT 1,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_prefix (prefix),
    INDEX idx_frequency (frequency),
    INDEX idx_suggestion_type (suggestion_type)
);
```

## 🔧 **Detailed Component Design**

### 🕷️ **Crawler Service**
```python
class CrawlerService:
    def __init__(self, db_connection, queue_client, parser_service, 
                 index_service, event_stream):
        self.db = db_connection
        self.queue = queue_client
        self.parser = parser_service
        self.index = index_service
        self.event_stream = event_stream
    
    def crawl_url(self, url, priority=1):
        """Add URL to crawl queue"""
        # Check if URL already exists
        url_hash = self.generate_url_hash(url)
        existing_page = self.db.session.query(WebPage).filter_by(
            url_hash=url_hash
        ).first()
        
        if existing_page:
            # Update crawl priority if needed
            if priority > existing_page.crawl_priority:
                existing_page.crawl_priority = priority
                self.db.session.commit()
            return existing_page
        
        # Create new page record
        page = WebPage(
            url_hash=url_hash,
            url=url,
            domain=self.extract_domain(url),
            crawl_priority=priority
        )
        
        self.db.session.add(page)
        self.db.session.commit()
        
        # Add to crawl queue
        self.queue.add_crawl_job(url, priority)
        
        return page
    
    def process_crawl_job(self, url):
        """Process a single crawl job"""
        try:
            # Fetch page content
            response = self.fetch_page(url)
            
            if not response or response.status_code != 200:
                return self.handle_crawl_failure(url, response)
            
            # Parse page content
            parsed_content = self.parser.parse_page(response.content, response.url)
            
            # Update page record
            page = self.update_page_content(url, parsed_content, response)
            
            # Extract and queue new URLs
            new_urls = self.extract_links(parsed_content, response.url)
            for new_url in new_urls:
                self.crawl_url(new_url, priority=1)
            
            # Index the page
            self.index.index_page(page, parsed_content)
            
            # Publish event
            self.event_stream.publish('page_crawled', {
                'url': url,
                'page_id': page.id,
                'content_length': len(response.content),
                'timestamp': page.last_crawled_at.isoformat()
            })
            
            return page
            
        except Exception as e:
            return self.handle_crawl_error(url, str(e))
    
    def fetch_page(self, url):
        """Fetch page content with proper headers and rate limiting"""
        headers = {
            'User-Agent': 'SearchEngineBot/1.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        
        # Rate limiting
        self.rate_limit_domain(url)
        
        response = requests.get(url, headers=headers, timeout=30)
        return response
    
    def extract_links(self, parsed_content, base_url):
        """Extract links from parsed content"""
        links = []
        base_domain = self.extract_domain(base_url)
        
        for link in parsed_content.get('links', []):
            href = link.get('href')
            if not href:
                continue
            
            # Normalize URL
            absolute_url = urljoin(base_url, href)
            
            # Filter links
            if self.should_crawl_url(absolute_url, base_domain):
                links.append(absolute_url)
        
        return links
    
    def should_crawl_url(self, url, base_domain):
        """Determine if URL should be crawled"""
        # Skip non-HTTP URLs
        if not url.startswith(('http://', 'https://')):
            return False
        
        # Skip common non-content URLs
        skip_patterns = [
            r'\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|exe|dmg)$',
            r'\.(jpg|jpeg|png|gif|bmp|svg|ico)$',
            r'\.(mp3|mp4|avi|mov|wmv|flv)$',
            r'/admin/', r'/login', r'/logout',
            r'#', r'javascript:', r'mailto:'
        ]
        
        for pattern in skip_patterns:
            if re.search(pattern, url, re.IGNORECASE):
                return False
        
        return True
```

### 🔍 **Search Service**
```python
class SearchService:
    def __init__(self, elasticsearch_client, ranking_engine, autocomplete_service, 
                 analytics_service, cache_client):
        self.es = elasticsearch_client
        self.ranking = ranking_engine
        self.autocomplete = autocomplete_service
        self.analytics = analytics_service
        self.cache = cache_client
    
    def search(self, query, filters=None, page=1, limit=10, user_id=None):
        """Perform search query"""
        # Try cache first
        cache_key = self.generate_cache_key(query, filters, page, limit)
        cached_results = self.cache.get(cache_key)
        
        if cached_results:
            return json.loads(cached_results)
        
        # Parse and expand query
        parsed_query = self.parse_query(query)
        expanded_query = self.expand_query(parsed_query)
        
        # Build search request
        search_body = self.build_search_request(expanded_query, filters, page, limit)
        
        # Execute search
        results = self.es.search(index="web_pages", body=search_body)
        
        # Apply ranking
        ranked_results = self.ranking.rank_results(
            results['hits']['hits'], query, user_id
        )
        
        # Format results
        formatted_results = self.format_results(ranked_results)
        
        # Cache results
        self.cache.setex(cache_key, 300, json.dumps(formatted_results))  # 5 min TTL
        
        # Track analytics
        self.analytics.track_search(query, len(formatted_results), user_id)
        
        return formatted_results
    
    def build_search_request(self, query, filters, page, limit):
        """Build Elasticsearch search request"""
        search_body = {
            "query": {
                "bool": {
                    "must": [
                        {"multi_match": {
                            "query": query,
                            "fields": [
                                "title^3",
                                "content^2", 
                                "headings^2",
                                "meta_description^1"
                            ],
                            "type": "best_fields",
                            "fuzziness": "AUTO"
                        }}
                    ],
                    "filter": [
                        {"term": {"is_active": True}},
                        {"range": {"spam_score": {"lt": 0.5}}}
                    ]
                }
            },
            "sort": [
                {"_score": {"order": "desc"}},
                {"page_rank": {"order": "desc"}},
                {"freshness_score": {"order": "desc"}}
            ],
            "from": (page - 1) * limit,
            "size": limit,
            "highlight": {
                "fields": {
                    "title": {},
                    "content": {"fragment_size": 150, "number_of_fragments": 2}
                }
            }
        }
        
        # Add filters
        if filters:
            if filters.get('language'):
                search_body["query"]["bool"]["filter"].append(
                    {"term": {"language": filters['language']}}
                )
            if filters.get('content_type'):
                search_body["query"]["bool"]["filter"].append(
                    {"term": {"content_type": filters['content_type']}}
                )
            if filters.get('date_range'):
                search_body["query"]["bool"]["filter"].append(
                    {"range": {"last_crawled_at": filters['date_range']}}
                )
        
        return search_body
    
    def parse_query(self, query):
        """Parse and analyze search query"""
        # Basic query parsing
        parsed = {
            'original': query,
            'terms': query.lower().split(),
            'language': self.detect_language(query),
            'intent': self.detect_intent(query)
        }
        
        # Extract entities
        parsed['entities'] = self.extract_entities(query)
        
        # Extract filters
        parsed['filters'] = self.extract_filters(query)
        
        return parsed
    
    def expand_query(self, parsed_query):
        """Expand query with synonyms and related terms"""
        expanded_terms = []
        
        for term in parsed_query['terms']:
            # Add original term
            expanded_terms.append(term)
            
            # Add synonyms
            synonyms = self.get_synonyms(term)
            expanded_terms.extend(synonyms)
            
            # Add stemming variations
            stemmed = self.get_stemmed_forms(term)
            expanded_terms.extend(stemmed)
        
        return ' '.join(expanded_terms)
    
    def get_autocomplete_suggestions(self, prefix, limit=10):
        """Get autocomplete suggestions"""
        return self.autocomplete.get_suggestions(prefix, limit)
```

### 🏆 **Ranking Engine**
```python
class RankingEngine:
    def __init__(self, ml_model, cache_client):
        self.ml_model = ml_model
        self.cache = cache_client
    
    def rank_results(self, search_results, query, user_id=None):
        """Rank search results using multiple factors"""
        ranked_results = []
        
        for hit in search_results:
            score = self.calculate_relevance_score(hit, query, user_id)
            ranked_results.append({
                'hit': hit,
                'score': score
            })
        
        # Sort by score
        ranked_results.sort(key=lambda x: x['score'], reverse=True)
        
        return [result['hit'] for result in ranked_results]
    
    def calculate_relevance_score(self, hit, query, user_id=None):
        """Calculate relevance score for a search result"""
        source = hit['_source']
        
        # Base score from Elasticsearch
        base_score = hit['_score']
        
        # PageRank score
        pagerank_score = source.get('page_rank', 0) * 0.3
        
        # Freshness score
        freshness_score = self.calculate_freshness_score(source.get('last_crawled_at'))
        
        # Content quality score
        quality_score = self.calculate_quality_score(source)
        
        # User personalization score
        personalization_score = 0
        if user_id:
            personalization_score = self.calculate_personalization_score(
                source, query, user_id
            )
        
        # Spam penalty
        spam_penalty = source.get('spam_score', 0) * 0.5
        
        # Combine scores
        final_score = (
            base_score * 0.4 +
            pagerank_score * 0.2 +
            freshness_score * 0.1 +
            quality_score * 0.2 +
            personalization_score * 0.1 -
            spam_penalty
        )
        
        return max(0, final_score)
    
    def calculate_freshness_score(self, last_crawled_at):
        """Calculate freshness score based on last crawl time"""
        if not last_crawled_at:
            return 0
        
        days_since_crawl = (datetime.now() - last_crawled_at).days
        
        if days_since_crawl <= 1:
            return 1.0
        elif days_since_crawl <= 7:
            return 0.8
        elif days_since_crawl <= 30:
            return 0.6
        elif days_since_crawl <= 90:
            return 0.4
        else:
            return 0.2
    
    def calculate_quality_score(self, source):
        """Calculate content quality score"""
        quality_factors = {
            'word_count': min(source.get('word_count', 0) / 1000, 1.0),
            'has_title': 1.0 if source.get('title') else 0.0,
            'has_description': 1.0 if source.get('meta_description') else 0.0,
            'has_headings': 1.0 if source.get('headings') else 0.0,
            'domain_authority': source.get('domain_authority', 0)
        }
        
        # Weighted average
        weights = [0.3, 0.2, 0.2, 0.1, 0.2]
        quality_score = sum(factor * weight for factor, weight in 
                          zip(quality_factors.values(), weights))
        
        return quality_score
    
    def calculate_personalization_score(self, source, query, user_id):
        """Calculate personalization score based on user history"""
        # Get user's search and click history
        user_history = self.get_user_history(user_id)
        
        if not user_history:
            return 0
        
        # Calculate similarity with user's preferred domains
        user_domains = set(click['domain'] for click in user_history)
        current_domain = source.get('domain')
        
        if current_domain in user_domains:
            return 0.3
        
        return 0
```

### 🔤 **Autocomplete Service**
```python
class AutocompleteService:
    def __init__(self, redis_client, db_connection):
        self.redis = redis_client
        self.db = db_connection
    
    def get_suggestions(self, prefix, limit=10):
        """Get autocomplete suggestions for prefix"""
        if len(prefix) < 2:
            return []
        
        # Try cache first
        cache_key = f"autocomplete:{prefix.lower()}"
        cached_suggestions = self.redis.get(cache_key)
        
        if cached_suggestions:
            return json.loads(cached_suggestions)
        
        # Get suggestions from database
        suggestions = self.db.session.query(AutocompleteSuggestion).filter(
            AutocompleteSuggestion.prefix == prefix.lower()
        ).order_by(
            AutocompleteSuggestion.frequency.desc(),
            AutocompleteSuggestion.last_used_at.desc()
        ).limit(limit).all()
        
        # Format suggestions
        formatted_suggestions = [
            {
                'suggestion': s.suggestion,
                'type': s.suggestion_type,
                'frequency': s.frequency
            }
            for s in suggestions
        ]
        
        # Cache suggestions
        self.redis.setex(cache_key, 3600, json.dumps(formatted_suggestions))  # 1 hour TTL
        
        return formatted_suggestions
    
    def add_suggestion(self, prefix, suggestion, suggestion_type='query'):
        """Add new autocomplete suggestion"""
        # Check if suggestion already exists
        existing = self.db.session.query(AutocompleteSuggestion).filter_by(
            prefix=prefix.lower(),
            suggestion=suggestion
        ).first()
        
        if existing:
            # Update frequency and last used time
            existing.frequency += 1
            existing.last_used_at = datetime.now()
        else:
            # Create new suggestion
            new_suggestion = AutocompleteSuggestion(
                prefix=prefix.lower(),
                suggestion=suggestion,
                suggestion_type=suggestion_type
            )
            self.db.session.add(new_suggestion)
        
        self.db.session.commit()
        
        # Clear cache
        cache_key = f"autocomplete:{prefix.lower()}"
        self.redis.delete(cache_key)
    
    def update_suggestion_frequency(self, prefix, suggestion):
        """Update suggestion frequency when used"""
        suggestion_record = self.db.session.query(AutocompleteSuggestion).filter_by(
            prefix=prefix.lower(),
            suggestion=suggestion
        ).first()
        
        if suggestion_record:
            suggestion_record.frequency += 1
            suggestion_record.last_used_at = datetime.now()
            self.db.session.commit()
```

## ⚡ **Performance Optimization**

### 🗄️ **Caching Strategy**
```
Cache Layers:
1. Search Cache (Redis):
   - Search results: TTL 5 minutes
   - Query suggestions: TTL 1 hour
   - Popular queries: TTL 24 hours

2. Index Cache (Redis):
   - Page metadata: TTL 1 hour
   - Domain authority: TTL 6 hours
   - PageRank scores: TTL 12 hours

3. Crawler Cache (Redis):
   - Robots.txt: TTL 24 hours
   - Sitemap data: TTL 6 hours
   - Rate limiting: TTL 1 minute

4. CDN Cache:
   - Static assets
   - Search result pages
   - Geographic distribution
```

### 📊 **Database Optimization**
```
Indexing Strategy:
- Primary keys on url_hash and page_id
- Full-text search indexes on content
- Composite indexes for crawl queries
- Partitioning by domain for pages

Sharding Strategy:
- Shard pages by domain
- Shard search logs by date
- Use read replicas for search queries
```

## 🔒 **Security Considerations**

### 🛡️ **Spam Detection**
```python
class SpamDetectionService:
    def __init__(self, ml_classifier, rules_engine):
        self.ml_classifier = ml_classifier
        self.rules_engine = rules_engine
    
    def detect_spam(self, page_content, page_metadata):
        """Detect spam content in web pages"""
        # Rule-based checks
        rule_score = self.rules_engine.check_spam_rules(page_content, page_metadata)
        
        # ML-based classification
        ml_score = self.ml_classifier.classify_spam(page_content)
        
        # Combine scores
        final_score = (rule_score * 0.4) + (ml_score * 0.6)
        
        return {
            'is_spam': final_score > 0.7,
            'spam_score': final_score,
            'rule_score': rule_score,
            'ml_score': ml_score
        }
    
    def check_spam_rules(self, content, metadata):
        """Apply rule-based spam detection"""
        score = 0
        
        # Check for excessive keywords
        keyword_density = self.calculate_keyword_density(content)
        if keyword_density > 0.05:  # 5% threshold
            score += 0.3
        
        # Check for hidden text
        if self.has_hidden_text(content):
            score += 0.4
        
        # Check for link spam
        link_spam_ratio = self.calculate_link_spam_ratio(content)
        if link_spam_ratio > 0.1:  # 10% threshold
            score += 0.3
        
        # Check domain age
        if metadata.get('domain_age_days', 0) < 30:
            score += 0.2
        
        return min(1.0, score)
```

## 📈 **Scalability Strategies**

### 🔄 **Horizontal Scaling**
```
Service Scaling:
- Stateless search service instances
- Crawler workers with distributed queues
- Indexing service with sharded storage
- Ranking engine with ML model serving

Load Distribution:
- Geographic load balancing
- Query-based routing
- Content type-specific processing
- Regional result prioritization
```

## 🚨 **Monitoring & Alerting**

### 📊 **Key Metrics**
```
Business Metrics:
- Search queries per day
- Click-through rates
- Average search result position
- User satisfaction scores
- Index coverage and freshness

Technical Metrics:
- Search response times
- Index update latency
- Crawl success rates
- Cache hit rates
- Query processing throughput
```

## 🧪 **Testing Strategy**

### 🔬 **Testing Approaches**
```
Unit Testing:
- Query parsing and expansion
- Ranking algorithms
- Spam detection rules
- Autocomplete logic

Integration Testing:
- End-to-end search flow
- Crawler pipeline
- Indexing process
- Analytics tracking

Load Testing:
- High-concurrency search queries
- Crawl rate limits
- Index update performance
- Cache effectiveness
```

---

**This search engine system design provides a comprehensive, scalable platform for web search with advanced crawling, indexing, ranking, and real-time search capabilities.** 