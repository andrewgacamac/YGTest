# Product Requirements Document (PRD) - YardGuard Backend
**Status:** Draft / High-Level Concept
**Last Updated:** 2026-01-18

## 1. Executive Summary
The YardGuard Backend is the engine that powers the "Design Visualization" promise. It allows potential customers to upload photos of their property (backyard, front yard, etc.) along with their service request. The system leverages AI to automatically process these images—replacing natural grass with artificial turf—and drafts an initial estimate email. An Admin Portal allows staff to review, edit, and approve these assets before they are finalized for the customer.

## 2. High-Level Architecture
*(Note: Visual diagram to be generated separately)*

1.  **Customer Frontend (Web):**
    *   Submits Project Details (Size, Package, etc.).
    *   **New Feature:** Uploads multiple photos of the property.
2.  **Backend Core:**
    *   Receives and stores customer data.
    *   Orchestrates the AI workflows.
3.  **AI Engine:**
    *   **Visualizer:** Analyzes uploaded photos, identifies grass areas, and generates a "After" image with artificial turf overlay.
    *   **Estimator:** Analyzes project inputs + image data to draft a personalized email response with pricing estimates.
4.  **Admin Portal:**
    *   Dashboard for Admins to view incoming requests.
    *   Interface to view "Before" vs. "AI-Generated After" images.
    *   Interface to read and edit the AI-drafted email.
    *   Action: "Mark as Ready" (Email sending logic is out of scope for Phase 1).

## 3. User Personas & User Stories

### 3.1 The Customer (Homeowner)
*   **Goal:** Wants to see how their specific yard would look with YardGuard turf and get a quick price estimate.
*   **Story:** "As a homeowner, I want to upload pictures of my muddy backyard so I can get a visualization of the potential upgrade."

### 3.2 The Admin (YardGuard Staff)
*   **Goal:** Efficiently process leads without manually editing photos in Photoshop or writing emails from scratch.
*   **Story:** "As an admin, I want to log in and see a list of new requests, with the visualization already done by AI, so I just have to approve it and hit send."

## 4. Functional Requirements

### 4.1 Intake & Storage
*   **FR-01:** System must accept multiple image uploads (JPG/PNG) associated with a single quote request.
*   **FR-02:** System must store customer contact details and project preferences (Package type, approximate size).

### 4.2 AI Processing
*   **FR-03 (Visualizer):** System must process uploaded images to identify grass/dirt regions and mask them with a "Turf" texture.
*   **FR-04 (Drafter):** System must generate a draft email text that includes:
    *   Greeting with customer name.
    *   Reference to the specific package chosen (e.g., Pet Yard).
    *   Estimated price range based on user-provided size.

### 4.3 Admin Workflow
*   **FR-05:** Admin must be able to view a queue of "Pending" requests.
*   **FR-06:** Admin must be able to open a request and see side-by-side "Original" vs "AI Result".
*   **FR-07:** Admin must be able to edit the AI-drafted email text.
*   **FR-08:** Admin must be able to flag an AI image as "Poor Quality" (optional manual override workflow).
*   **FR-09:** Admin must include a "Mark as Ready" status change.

## 5. Data Flow (high level)
`Customer Upload` -> `Storage` -> `Trigger AI` -> `Save AI Result` -> `Admin Notification` -> `Admin Review/Edit` -> `Ready for Delivery`
