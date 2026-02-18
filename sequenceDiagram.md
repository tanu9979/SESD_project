```mermaid
sequenceDiagram
participant Buyer
participant Frontend
participant Backend
participant Seller
participant DB

Buyer->>Frontend: Select Book & Place Order
Frontend->>Backend: Create Order Request
Backend->>DB: Save Order (Pending)
Backend->>Seller: Notify Order Request
Seller->>Backend: Confirm Order
Backend->>DB: Update Order Status
Backend->>Frontend: Order Confirmed
Frontend->>Buyer: Show Confirmation
```