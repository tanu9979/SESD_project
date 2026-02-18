# Use Case Diagram

```mermaid
usecaseDiagram
actor User
actor Admin

User --> (Register/Login)
User --> (Create Book Listing)
User --> (Browse Books)
User --> (Search & Filter Books)
User --> (Buy Book)
User --> (Rent Book)
User --> (Track Orders/Rentals)
User --> (Return Rented Book)

Admin --> (Manage Users)
Admin --> (Remove Listings)
Admin --> (View Transactions)
```