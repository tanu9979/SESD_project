# Folio — Old Books Buy, Sell & Rent Platform

## Project Idea

A peer-to-peer web platform where users can buy, sell, rent, and donate second-hand books. The goal is to make books more accessible and affordable while reducing waste by giving every book a second life.

## Scope

The platform supports three roles — Buyer, Seller/Donor, and Admin — on a single user account. A user can list books for sale, rent, or free donation, while simultaneously browsing and purchasing books from others.

## Key Features

### Buyer
- Register and login with auto country/currency detection via IP
- Browse, search, and filter books by type, condition, category, and exam tag
- Add books to cart and checkout with saved or new address
- Live estimated delivery date shown at checkout based on pincodes
- Online payment (card / UPI / Cash on Delivery)
- Track order through stages: Placed → Payment Confirmed → Processing → Shipped → Out for Delivery → Delivered
- Rent a book for a set number of days and return when done
- Request free donated books (pays delivery charges only)
- Rate the seller after delivery
- Real-time chat with seller before or after purchase
- Submit platform feedback

### Seller / Donor
- Create book listings with type: sell, rent, both, or donate
- Add personal reading insights to a listing
- Add a donor message when donating a book
- View and manage incoming orders
- Confirm or cancel orders
- Chat with buyers

### Admin
- View and delete user accounts
- Remove book listings
- View all transactions (orders + rentals)
- Read all user feedback

## Special Features
- Exam tag filter for Indian users (NEET, JEE, UPSC, GATE, CAT, CLAT, NDA, etc.) — shown only when user's country is India
- Live price conversion using frankfurter.app (170+ currencies)
- Auto location detection on first visit via ip-api.com
- Pincode-based delivery estimation (no external API — uses prefix matching logic)
- Real-time buyer-seller chat using Socket.io
