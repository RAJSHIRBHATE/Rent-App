# Rent Electronics - Electronic Appliance Rental Website

A modern, responsive web application for renting electronic appliances built with HTML, CSS, and JavaScript.

## Features

### Customer Features
- **User Registration & Login**: Create an account and securely login
- **Product Browsing**: View 7 electronic items available for rent
  - Refrigerator
  - Washing Machine
  - Television
  - Microwave Oven
  - Iron
  - Air Conditioner
  - Water Purifier
- **Product Details**: View detailed information including:
  - Monthly rental charges
  - Security deposit
  - Special offers
  - Features and descriptions
  - Rental period options (1, 3, 6, 12 months)
- **Shopping Cart**: Add items to cart and manage selections
- **Checkout**: Place orders with delivery address
- **Order Placement**: Complete orders and receive confirmation

### Shop Owner Features
- **Owner Login**: Separate login portal for shop owners
- **Order Management**: View all customer orders
- **Notifications**: See new orders with notification badges
- **Order Processing**: Mark orders as processed after shipping

## Getting Started

1. Open `index.html` in a web browser
2. The application uses localStorage, so no server setup is required

## Default Credentials

### Shop Owner Login
- **Email**: `owner@rentelectronics.com`
- **Password**: `owner123`

### Customer Account
- Register a new account from the registration page
- Or use any email/password combination after registration

## File Structure

```
Rent App/
├── index.html              # Customer login page
├── register.html           # Customer registration
├── owner-login.html        # Shop owner login
├── customer-dashboard.html # Product listing page
├── product-detail.html     # Individual product details
├── cart.html              # Shopping cart
├── checkout.html          # Checkout and order placement
├── owner-dashboard.html   # Owner order management
├── styles.css             # All styling
├── script.js              # All functionality
└── README.md             # This file
```

## How to Use

### For Customers:
1. Register a new account or login
2. Browse available electronic items
3. Click on any product to view details
4. Select rental period and add to cart
5. Review cart and proceed to checkout
6. Enter delivery address and place order
7. Owner will be notified automatically

### For Shop Owners:
1. Login with owner credentials
2. View all orders in the dashboard
3. New orders are highlighted with a red badge
4. Review customer details and delivery address
5. Mark orders as processed after shipping items

## Technical Details

- **Storage**: Uses browser localStorage for data persistence
- **No Backend**: Fully client-side application
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## Notes

- All data is stored locally in the browser
- Clearing browser data will reset all information
- For production use, integrate with a backend database

