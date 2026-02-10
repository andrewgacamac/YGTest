```mermaid
graph TD
    %% Nodes
    C[Customer]
    W[Website Frontend]
    
    subgraph "YardGuard Backend"
        API[Backend API]
        DB[(Database)]
        S3[File Storage]
        
        subgraph "AI Engine"
            VIS[AI Visualizer\n(Grass -> Turf)]
            EST[AI Estimator\n(Draft Email)]
        end
    end
    
    A[Admin User]
    AP[Admin Portal]

    %% Flow
    C -->|1. Uploads Photos & Info| W
    W -->|2. Submit Data| API
    
    API -->|3. Store Data| DB
    API -->|4. Store Images| S3
    
    API -->|5. Trigger Processing| VIS
    S3 -.->|Fetch Original| VIS
    VIS -->|6. Save Generated Image| S3
    
    API -->|7. Trigger Draft| EST
    DB -.->|Fetch Details| EST
    EST -->|8. Save Email Draft| DB
    
    AP -->|9. Review Queue| API
    A -->|10. View & Edit| AP
    AP -->|11. Mark Ready| API
```
