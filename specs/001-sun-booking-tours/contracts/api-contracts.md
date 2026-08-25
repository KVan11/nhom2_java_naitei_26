# REST API Contracts

## 1. Authentication (`/api/auth`)

- `POST /api/auth/register`: Register Guest account.
- `POST /api/auth/login`: Sign in with credentials (returns JWT).
- `POST /api/auth/social`: Authenticate via Facebook, Twitter, or Google token.
- `POST /api/auth/logout`: Sign out (client-side discard or token blacklist).

## 2. Users (`/api/users`)

- `GET /api/users/me`: View profile (User).
- `PUT /api/users/me`: Update profile (User).
- `GET /api/users`: Manage users (Admin).

## 3. Tours & Categories (`/api/tours`, `/api/categories`)

- `GET /api/categories`: List categories.
- `GET /api/tours`: View and search tours.
- `POST /api/tours`: Create tour (Admin).
- `PUT /api/tours/{id}`: Update tour (Admin).

## 4. Bookings (`/api/bookings`)

- `POST /api/bookings`: Create booking (User).
- `GET /api/bookings`: List bookings (Admin) or User's own bookings.
- `PUT /api/bookings/{id}/cancel`: Cancel booking (User, Admin).

## 5. Payments (`/api/payments`)

- `POST /api/payments`: Initiate a SePay VietQR payment checkout for a Booking (reserves capacity for 15 mins and returns QR info).
- `GET /api/payments/{bookingId}`: Retrieve current Payment status.
- `POST /api/payments/webhook`: Receive and verify SePay webhook payload to confirm payment.

## 6. Reviews, Comments, Likes (`/api/reviews`)

- `GET /api/reviews`: List tour reviews.
- `POST /api/reviews`: Create new review for a booking.
- `POST /api/reviews/{id}/comments`: Comment on a review.
- `POST /api/reviews/comments/{id}/reply`: Reply to a comment.
- `POST /api/reviews/{id}/like`: Like a review.

## 7. Revenue (`/api/admin/revenue`)

- `GET /api/admin/revenue`: View revenue metrics (Admin).
