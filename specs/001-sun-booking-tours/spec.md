# Feature Specification: SUN Booking Tours

**Feature Branch**: `001-sun-booking-tours`

**Created**: 2026-08-17

**Status**: Approved

**Input**: User description: "Create the functional specification for SUN Booking Tours based strictly on the following approved requirements..."

## Clarifications

### Session 2026-08-18
- Q: What payment mechanism should be used and should users manage bank accounts? → A: Use SePay Test Mode + VietQR + Webhook, and drop the User manage bank account feature entirely.
- Q: How should the system prevent overbooking when multiple users try to book the last available spots for a tour simultaneously? → A: Temporarily reserve capacity (e.g., 15 minutes) when the user initiates the SePay payment. If unpaid, release the capacity.

### Session 2026-08-21
- Q: Should Twitter be removed from the social login scope since recent code only implements Google and Facebook? → A: Yes, drop Twitter and focus on Google/Facebook.
- Q: When an Admin deletes a Category, what should happen to the Tours associated with it? → A: Soft delete the Category, keeping Tours intact.
- Q: Should the 15-minute capacity reservation limit be a strict system rule? → A: Yes, strict 15 minutes (configurable via properties).

### Session 2026-08-22
- Q: What specific actions can an Admin perform when managing a booking? → A: Admin can view lists, view details, search/filter (status, tour, departure, booking date, customer), view payment and travelers, cancel bookings, and update booking status when needed. Admin cannot create, edit details (travelers, price, guest count), delete bookings, or manually confirm bookings.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Authentication and Profile Management (Priority: P1)

Guests register an account to become a User. Users sign in, sign out, or authenticate using external social providers (Facebook or Google). Users can manage their user profile.

**Why this priority**: Essential foundation for personalized interactions, bookings, and payments.

**Independent Test**: Can be fully tested by verifying a Guest can register, sign in using credentials or OAuth, update profile details, and sign out, resulting in a session state change.

**Acceptance Scenarios**:

1. **Given** a Guest, **When** they provide valid registration details, **Then** an account is created and they can sign in.
2. **Given** an unauthenticated User, **When** they choose to sign in via Facebook or Google, **Then** they are authenticated and gain User privileges.
3. **Given** an authenticated User, **When** they update their profile details, **Then** the information is saved.

---

### User Story 2 - Tour Discovery (Priority: P1)

Guests and Users can view tours, search for specific tours, and view tour reviews.

**Why this priority**: Core value proposition; users must find tours before they can book them.

**Independent Test**: Can be fully tested by performing a search with specific criteria and verifying the correct tours and related reviews are displayed.

**Acceptance Scenarios**:

1. **Given** a Guest or User, **When** they search for a tour by criteria, **Then** the system displays matching tours.
2. **Given** a Guest or User, **When** they request information, **Then** they can view tour reviews.

---

### User Story 3 - Tour Booking and Payment (Priority: P1)

Users can book a tour and pay for it using SePay Test Mode via VietQR. The system receives payment confirmation automatically via Webhook. A tour can also be cancelled.

**Why this priority**: The primary revenue-generating action of the system.

**Independent Test**: Can be fully tested by a User selecting a tour, submitting a booking request, completing a SePay payment flow, and verifying the booking is recorded.

**Acceptance Scenarios**:

1. **Given** an authenticated User, **When** they book a tour and complete payment via SePay VietQR (confirmed by Webhook), **Then** the booking is confirmed and payment is recorded.
2. **Given** a booked tour, **When** a valid cancellation is initiated, **Then** the tour booking is cancelled.

---

### User Story 4 - Community Engagement (Priority: P2)

Users manage their own reviews, create new reviews, comment on a review, comment on a comment, like reviews, and rate a tour.

**Why this priority**: Important for user engagement and building trust on the platform.

**Independent Test**: Can be fully tested by a User rating a tour, writing a review, and another User liking and commenting on that review.

**Acceptance Scenarios**:

1. **Given** an authenticated User, **When** they submit a review and rating for a tour, **Then** the review and rating are visible to others.
2. **Given** an existing review, **When** a User likes or comments on it, **Then** the metrics and discussion thread are updated.

---

### User Story 5 - Platform Administration (Priority: P1)

Admins manage users, tours, booking requests, user reviews, revenue, and categories.

**Why this priority**: Required for operational oversight, content moderation, and business management.

**Independent Test**: Can be fully tested by an Admin creating a new category, adding a tour to it, and managing a booking request.

**Acceptance Scenarios**:

1. **Given** an Admin, **When** they manage tours or categories, **Then** the updates are immediately reflected on the platform for Guests and Users.
2. **Given** an Admin reviewing booking requests, **When** they process a request, **Then** they can view booking details, search/filter, cancel bookings, and update status, but cannot edit booking data, create new bookings, delete bookings, or manually confirm bookings.

---

### Edge Cases

- What happens when a User attempts to pay for a tour but the SePay transaction times out? (Capacity is automatically released after a strict 15-minute limit, configurable via properties, and booking state becomes expired/failed).
- How does the system handle concurrent booking requests for a tour with limited capacity? (Capacity is temporarily reserved when SePay payment is initiated).
- What happens if a User tries to comment on a review that has just been deleted by an Admin or the author?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow Guests to register a new account.
- **FR-002**: System MUST allow Users to sign in using standard credentials or authenticate via Facebook or Google.
- **FR-003**: System MUST allow Users to sign out.
- **FR-004**: System MUST allow Users to manage their profile.
- **FR-005**: System MUST allow Guests and Users to view tours, search tours, and view tour reviews.
- **FR-006**: System MUST allow Users to book a tour.
- **FR-007**: System MUST allow Users to pay for a tour exclusively via SePay Test Mode + VietQR + Webhook.
- **FR-008**: System MUST allow both Admins and Users to cancel a booked tour.
- **FR-009**: System MUST allow Users to create new reviews, manage their own reviews, comment on reviews, comment on comments, like reviews, and rate tours.
- **FR-010**: System MUST allow Admins to manage Users, Tours, booking requests, user reviews, revenue, and categories. For booking requests specifically, Admins CAN view, search, filter, cancel, and update status, but CANNOT create, edit details, delete, or manually confirm bookings.
- **FR-011**: System MUST soft-delete a Category when an Admin deletes it, keeping associated Tours intact.

### Key Entities

- **User**: Represents a registered individual (Guest becomes a User). Contains profile details.
- **Tour**: The core offering that can be viewed, searched, booked, and rated.
- **Category**: A classification for Tours.
- **Booking Request**: A business capability represented through the Booking workflow. It does not require a separate persistence entity.
- **Payment**: Represents the SePay transaction for a Booking (initiated via VietQR and confirmed via Webhook).
- **Review**: Content and rating generated by Users exclusively tied to their Tour Bookings.
- **Comment**: Responses attached to Reviews or other Comments.
- **Rating**: A quantitative evaluation of a tour represented by the `review.rating` field in the approved baseline database.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Guests can successfully register and Users can authenticate via all supported methods (Standard, Facebook, Google).
- **SC-002**: Users can complete a tour booking and SePay payment flow without encountering blocking errors.
- **SC-003**: Users can successfully search for tours and view associated reviews.
- **SC-004**: Admins can successfully view and modify records for users, tours, bookings, categories, and reviews.
- **SC-005**: All role-based constraints (Guest vs. User vs. Admin) are strictly enforced across actions.

## Assumptions

- External social authentication providers (Facebook, Google) are available and function using standard integration patterns.
- Payment is exclusively handled via SePay Test Mode using VietQR. The system relies on SePay Webhooks for payment confirmation. No additional payment methods are in scope.
- Standard web application patterns apply for displaying lists (e.g., viewing tours or reviews).
- "Manage" means the authorized role can perform the operations required by that approved business capability. It must not automatically be interpreted as full Create/Read/Update/Delete unless those operations are explicitly required.
- When a User successfully completes the payment process via SePay (confirmed by Webhook), the booking and payment records are updated consistently according to the approved booking workflow.
