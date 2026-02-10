# Diagram Options for YardGuard Architecture

Since image generation is currently unavailable, we can use **Mermaid** code to create distinct, professional technical diagrams. Here are the three most useful types for this project:

## 1. Flowchart (Great for Process Logic)
*Best for showing the step-by-step user journey and system decisions.*

```mermaid
flowchart LR
    A[Start: Upload Photos] --> B{Valid Format?}
    B -- No --> C[Error Message]
    B -- Yes --> D[Save to S3]
    D --> E[Trigger AI Visualizer]
    E --> F[Generate 'After' Image]
    F --> G[Notify Admin]
```

## 2. Sequence Diagram (Great for API/Data Flow)
*Best for showing how the Frontend, Backend, AI, and Database talk to each other over time.*

```mermaid
sequenceDiagram
    participant User
    participant Web
    participant API
    participant AI
    
    User->>Web: Uploads Photo
    Web->>API: POST /upload
    API->>AI: Send Image for Processing
    activate AI
    AI-->>API: Returns "After" Image URL
    deactivate AI
    API-->>Web: Update Status "Ready"
    Web-->>User: Show Success
```

## 3. Entity Relationship (ER) Diagram (Great for Database)
*Best for defining exactly what data fields we are storing.*

```mermaid
erDiagram
    CUSTOMER ||--o{ QUOTE_REQUEST : submits
    QUOTE_REQUEST ||--|{ PHOTO : contains
    
    CUSTOMER {
        string name
        string email
        string phone
    }
    
    QUOTE_REQUEST {
        int id
        string package_type
        string status "New/Ready/Sent"
        string ai_draft_text
    }
    
    PHOTO {
        int id
        string s3_url_original
        string s3_url_processed
    }
```
