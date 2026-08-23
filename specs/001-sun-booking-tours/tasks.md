# Implementation Tasks: 001-sun-booking-tours

## Phase 1: Setup

- [x] T001 [P] [CONFIG] Initialize React frontend project with Vite and Tailwind in `frontend/`
- [x] T002 [P] [CONFIG] Initialize Spring Boot backend project in `backend/`
- [x] T003 [CONFIG] Configure database connection in `backend/src/main/resources/application.yml`
- [x] T004 [DB] Run baseline database schema from `database/schema.sql`

## Phase 2: Shared Backend Foundation

- [x] T005 [P] [CONFIG] Setup global exception handler in `backend/src/main/java/com/sunbooking/exception/GlobalExceptionHandler.java`
- [x] T006 [P] [SECURITY] Setup JWT utility class in `backend/src/main/java/com/sunbooking/security/JwtUtils.java`
- [x] T007 [SECURITY] Setup Spring Security configuration in `backend/src/main/java/com/sunbooking/security/SecurityConfig.java`
- [x] T008 [P] [BE-AUTH] Create BaseEntity in `backend/src/main/java/com/sunbooking/entity/BaseEntity.java`

## Phase 3: Authentication (US1)

- [x] T009 [P] [US1] [BE-AUTH] Create `User` entity in `backend/src/main/java/com/sunbooking/entity/User.java`
- [ ] T010 [P] [US1] [BE-AUTH] Create `SocialAccount` entity in `backend/src/main/java/com/sunbooking/entity/SocialAccount.java`
- [x] T011 [P] [US1] [BE-AUTH] Create auth request/response DTOs in `backend/src/main/java/com/sunbooking/dto/auth/`
- [x] T012 [US1] [BE-AUTH] Create `UserRepository` in `backend/src/main/java/com/sunbooking/repository/UserRepository.java`
- [x] T013 [US1] [BE-AUTH] Create `SocialAccountRepository` in `backend/src/main/java/com/sunbooking/repository/SocialAccountRepository.java`
- [x] T014 [US1] [BE-AUTH] Implement registration and login in `backend/src/main/java/com/sunbooking/service/AuthService.java`
- [x] T015 [US1] [BE-AUTH] Implement social login in `backend/src/main/java/com/sunbooking/service/SocialAuthService.java`
- [x] T016 [US1] [BE-AUTH] Implement auth APIs in `backend/src/main/java/com/sunbooking/controller/AuthController.java`
- [x] T017 [P] [US1] [FE-AUTH] Setup AuthContext for frontend state in `frontend/src/context/AuthContext.tsx`
- [x] T018 [US1] [FE-AUTH] Implement auth API client in `frontend/src/services/authService.ts`
- [x] T019 [P] [US1] [FE-AUTH] Create Login page in `frontend/src/pages/auth/LoginPage.tsx`
- [x] T020 [P] [US1] [FE-AUTH] Create Register page in `frontend/src/pages/auth/RegisterPage.tsx`

## Phase 4: User Profile (US1)

- [ ] T021 [P] [US1] [BE-USER] Create user profile DTOs in `backend/src/main/java/com/sunbooking/dto/user/`
- [ ] T022 [US1] [BE-USER] Implement profile management in `backend/src/main/java/com/sunbooking/service/UserService.java`
- [ ] T023 [US1] [BE-USER] Implement user profile API in `backend/src/main/java/com/sunbooking/controller/UserController.java`
- [ ] T024 [P] [US1] [FE-USER] Implement user API client in `frontend/src/services/userService.ts`
- [ ] T025 [US1] [FE-USER] Create Profile page in `frontend/src/pages/user/ProfilePage.tsx`

## Phase 5: Tour / Category (US2)

- [x] T026 [P] [US2] [BE-CATEGORY] Create `Category` entity in `backend/src/main/java/com/sunbooking/entity/Category.java`
- [x] T027 [P] [US2] [BE-TOUR] Create `Tour` entity in `backend/src/main/java/com/sunbooking/entity/Tour.java`
- [x] T028 [P] [US2] [BE-TOUR] Create `TourDeparture` entity in `backend/src/main/java/com/sunbooking/entity/TourDeparture.java`
- [x] T029 [P] [US2] [BE-TOUR] Create `TourImage` entity in `backend/src/main/java/com/sunbooking/entity/TourImage.java`
- [x] T030 [P] [US2] [BE-CATEGORY] Create `CategoryRepository` in `backend/src/main/java/com/sunbooking/repository/CategoryRepository.java`
- [x] T031 [P] [US2] [BE-TOUR] Create `TourRepository` in `backend/src/main/java/com/sunbooking/repository/TourRepository.java`
- [x] T032 [P] [US2] [BE-TOUR] Create `TourDepartureRepository` in `backend/src/main/java/com/sunbooking/repository/TourDepartureRepository.java`
- [x] T033 [P] [US2] [BE-TOUR] Create tour/category DTOs in `backend/src/main/java/com/sunbooking/dto/tour/`
- [x] T034 [US2] [BE-CATEGORY] Implement category listing in `backend/src/main/java/com/sunbooking/service/CategoryService.java`
- [x] T035 [US2] [BE-TOUR] Implement tour search/details in `backend/src/main/java/com/sunbooking/service/TourService.java`
- [x] T036 [US2] [BE-CATEGORY] Implement category APIs in `backend/src/main/java/com/sunbooking/controller/CategoryController.java`
- [x] T037 [US2] [BE-TOUR] Implement tour public APIs in `backend/src/main/java/com/sunbooking/controller/TourController.java`
- [ ] T038 [P] [US2] [FE-TOUR] Implement tour API client in `frontend/src/services/tourService.ts`
- [ ] T039 [US2] [FE-TOUR] Create tour search page in `frontend/src/pages/tours/TourSearchPage.tsx`
- [ ] T040 [US2] [FE-TOUR] Create tour details page in `frontend/src/pages/tours/TourDetailsPage.tsx`

## Phase 6: Place / Food / News (US2)

- [x] T041 [P] [US2] [BE-CONTENT] Create `Place` entity in `backend/src/main/java/com/sunbooking/entity/Place.java`
- [x] T042 [P] [US2] [BE-CONTENT] Create `TourPlace` entity in `backend/src/main/java/com/sunbooking/entity/TourPlace.java`
- [x] T043 [P] [US2] [BE-CONTENT] Create `Food` entity in `backend/src/main/java/com/sunbooking/entity/Food.java`
- [x] T044 [P] [US2] [BE-CONTENT] Create `News` entity in `backend/src/main/java/com/sunbooking/entity/News.java`
- [x] T045 [P] [US2] [BE-CONTENT] Create `PlaceRepository` in `backend/src/main/java/com/sunbooking/repository/PlaceRepository.java`
- [x] T046 [P] [US2] [BE-CONTENT] Create `TourPlaceRepository` in `backend/src/main/java/com/sunbooking/repository/TourPlaceRepository.java`
- [x] T047 [P] [US2] [BE-CONTENT] Create `FoodRepository` in `backend/src/main/java/com/sunbooking/repository/FoodRepository.java`
- [x] T048 [P] [US2] [BE-CONTENT] Create `NewsRepository` in `backend/src/main/java/com/sunbooking/repository/NewsRepository.java`
- [x] T049 [P] [US2] [BE-CONTENT] Create content DTOs in `backend/src/main/java/com/sunbooking/dto/content/`
- [x] T050 [US2] [BE-CONTENT] Implement `PlaceService` in `backend/src/main/java/com/sunbooking/service/PlaceService.java`
- [x] T051 [US2] [BE-CONTENT] Implement `FoodService` in `backend/src/main/java/com/sunbooking/service/FoodService.java`
- [x] T052 [US2] [BE-CONTENT] Implement `NewsService` in `backend/src/main/java/com/sunbooking/service/NewsService.java`
- [x] T053 [US2] [BE-CONTENT] Implement `ContentController` for public access in `backend/src/main/java/com/sunbooking/controller/ContentController.java`
- [ ] T054 [P] [US2] [FE-TOUR] Implement content API client in `frontend/src/services/contentService.ts`
- [ ] T055 [P] [US2] [FE-TOUR] Create places page in `frontend/src/pages/content/PlacesPage.tsx`
- [ ] T056 [P] [US2] [FE-TOUR] Create food presentation component in `frontend/src/components/content/FoodComponent.tsx`
- [ ] T057 [P] [US2] [FE-TOUR] Create news list page in `frontend/src/pages/content/NewsListPage.tsx`
- [ ] T058 [P] [US2] [FE-TOUR] Create news detail page in `frontend/src/pages/content/NewsDetailPage.tsx`

## Phase 7: Booking (US3)

- [x] T059 [P] [US3] [BE-BOOKING] Create `Booking` entity in `backend/src/main/java/com/sunbooking/entity/Booking.java`
- [x] T060 [P] [US3] [BE-BOOKING] Create `BookingTraveler` entity in `backend/src/main/java/com/sunbooking/entity/BookingTraveler.java`
- [x] T061 [P] [US3] [BE-BOOKING] Create booking request/response DTOs in `backend/src/main/java/com/sunbooking/dto/booking/`
- [x] T062 [US3] [BE-BOOKING] Create `BookingRepository` in `backend/src/main/java/com/sunbooking/repository/BookingRepository.java`
- [x] T063 [US3] [BE-BOOKING] Implement booking orchestration and creation in `backend/src/main/java/com/sunbooking/service/BookingService.java`
- [x] T064 [US3] [BE-BOOKING] Implement booking checkout API in `backend/src/main/java/com/sunbooking/controller/BookingController.java`
- [x] T065 [US3] [BE-BOOKING] Implement booking history API in `backend/src/main/java/com/sunbooking/controller/BookingHistoryController.java`
- [ ] T066 [P] [US3] [FE-BOOKING] Implement booking API client in `frontend/src/services/bookingService.ts`
- [ ] T067 [US3] [FE-BOOKING] Create booking form component in `frontend/src/components/booking/BookingForm.tsx`
- [ ] T068 [US3] [FE-BOOKING] Create user booking history page in `frontend/src/pages/user/BookingsPage.tsx`

## Phase 8: SePay / VietQR Payment (US3)

- [x] T069 [P] [US3] [BE-PAYMENT] Create `Payment` entity in `backend/src/main/java/com/sunbooking/entity/Payment.java`
- [x] T070 [P] [US3] [BE-PAYMENT] Create payment request/response DTOs in `backend/src/main/java/com/sunbooking/dto/payment/`
- [x] T071 [US3] [BE-PAYMENT] Create `PaymentRepository` in `backend/src/main/java/com/sunbooking/repository/PaymentRepository.java`
- [x] T072 [US3] [BE-PAYMENT] Setup SePay configuration in `backend/src/main/java/com/sunbooking/config/SePayConfig.java`
- [x] T073 [US3] [BE-PAYMENT] Implement payment initialization service (QR info generation) in `backend/src/main/java/com/sunbooking/service/PaymentService.java`
- [x] T074 [US3] [BE-PAYMENT] Implement atomic capacity reserve, confirm, release, and availability validation in `backend/src/main/java/com/sunbooking/service/CapacityService.java`
- [x] T075 [US3] [BE-PAYMENT] Implement scheduled reservation cleanup (cron) to detect expired reservations and invoke release logic in `backend/src/main/java/com/sunbooking/service/ReservationCleanupScheduler.java`
- [x] T076 [P] [US3] [BE-PAYMENT] Create SePay webhook request DTO in `backend/src/main/java/com/sunbooking/dto/payment/SePayWebhookRequest.java`
- [x] T077 [US3] [BE-PAYMENT] Implement SePay webhook authentication/verification in `backend/src/main/java/com/sunbooking/service/PaymentWebhookService.java`
- [x] T078 [US3] [BE-PAYMENT] Implement webhook transaction matching, idempotency, and capacity confirmation in `backend/src/main/java/com/sunbooking/service/PaymentConfirmationService.java`
- [x] T079 [US3] [BE-PAYMENT] Implement SePay webhook endpoint in `backend/src/main/java/com/sunbooking/controller/PaymentWebhookController.java`
- [x] T080 [US3] [BE-PAYMENT] Implement payment status query API in `backend/src/main/java/com/sunbooking/controller/PaymentController.java`
- [x] T081 [P] [US3] [FE-PAYMENT] Implement payment API client in `frontend/src/services/paymentService.ts`
- [x] T082 [US3] [FE-PAYMENT] Create VietQR checkout page in `frontend/src/pages/checkout/VietQrCheckoutPage.tsx`
- [x] T083 [US3] [FE-PAYMENT] Implement payment countdown frontend in `frontend/src/components/payment/PaymentCountdown.tsx`
- [x] T084 [US3] [FE-PAYMENT] Create payment success/failure feedback pages in `frontend/src/pages/checkout/PaymentResultPage.tsx`

## Phase 9: Reviews / Rating (US4)

- [X] T085 [P] [US4] [BE-REVIEW] Create `Review` entity in `backend/src/main/java/com/sunbooking/entity/Review.java`
- [X] T086 [P] [US4] [BE-REVIEW] Create `ReviewImage` entity in `backend/src/main/java/com/sunbooking/entity/ReviewImage.java`
- [X] T087 [P] [US4] [BE-REVIEW] Create review DTOs in `backend/src/main/java/com/sunbooking/dto/review/`
- [X] T088 [US4] [BE-REVIEW] Create `ReviewRepository` in `backend/src/main/java/com/sunbooking/repository/ReviewRepository.java`
- [X] T089 [US4] [BE-REVIEW] Implement review submission and validation in `backend/src/main/java/com/sunbooking/service/ReviewService.java`
- [X] T090 [US4] [BE-REVIEW] Implement review APIs in `backend/src/main/java/com/sunbooking/controller/ReviewController.java`
- [X] T091 [P] [US4] [FE-REVIEW] Implement review API client in `frontend/src/services/reviewService.ts`
- [X] T092 [P] [US4] [FE-REVIEW] Create review submission form in `frontend/src/components/reviews/ReviewForm.tsx`
- [X] T093 [US4] [FE-REVIEW] Create review list component in `frontend/src/components/reviews/ReviewList.tsx`

## Phase 10: Comments / Replies / Likes (US4)

- [X] T094 [P] [US4] [BE-COMMENT] Create `Comment` entity in `backend/src/main/java/com/sunbooking/entity/Comment.java`
- [X] T095 [P] [US4] [BE-COMMENT] Create `ReviewLike` entity in `backend/src/main/java/com/sunbooking/domain/review/entity/ReviewLike.java`
- [X] T096 [P] [US4] [BE-COMMENT] Create comment/like DTOs in `backend/src/main/java/com/sunbooking/domain/review/dto/`
- [X] T097 [US4] [BE-COMMENT] Create `CommentRepository` in `backend/src/main/java/com/sunbooking/repository/CommentRepository.java`
- [X] T098 [US4] [BE-COMMENT] Create `ReviewLikeRepository` in `backend/src/main/java/com/sunbooking/domain/review/repository/ReviewLikeRepository.java`
- [X] T099 [US4] [BE-COMMENT] Implement comment and reply logic in `backend/src/main/java/com/sunbooking/service/CommentService.java`
- [X] T100 [US4] [BE-COMMENT] Implement like toggle logic in `backend/src/main/java/com/sunbooking/domain/review/service/LikeService.java`
- [X] T101 [US4] [BE-COMMENT] Implement comment APIs in `backend/src/main/java/com/sunbooking/controller/CommentController.java`
- [X] T102 [US4] [BE-COMMENT] Implement like APIs in `backend/src/main/java/com/sunbooking/domain/review/controller/LikeController.java`
- [X] T103 [P] [US4] [FE-REVIEW] Implement comment and like API client in `frontend/src/services/commentService.ts`
- [X] T104 [P] [US4] [FE-REVIEW] Create comment thread UI in `frontend/src/components/reviews/CommentThread.tsx`
- [X] T105 [P] [US4] [FE-REVIEW] Create reply input UI in `frontend/src/components/reviews/ReplyInput.tsx`
- [X] T106 [P] [US4] [FE-REVIEW] Create like button UI in `frontend/src/components/reviews/LikeButton.tsx`

## Phase 11: Admin Frontend Foundation (US5)

- [ ] T107 [P] [US5] [FE-ADMIN] Create Admin shared layout in `frontend/src/layouts/AdminLayout.tsx`
- [ ] T108 [P] [US5] [FE-ADMIN] Create Admin sidebar/navigation in `frontend/src/components/admin/AdminSidebar.tsx`
- [ ] T109 [US5] [FE-ADMIN] Create Admin dashboard home page in `frontend/src/pages/admin/AdminDashboardPage.tsx`

## Phase 12: Admin User Management (US5)

- [ ] T110 [US5] [BE-ADMIN] Implement Admin User operations in `backend/src/main/java/com/sunbooking/service/AdminUserService.java`
- [ ] T111 [US5] [BE-ADMIN] Implement `AdminUserController` in `backend/src/main/java/com/sunbooking/controller/admin/AdminUserController.java`
- [ ] T112 [P] [US5] [FE-ADMIN] Implement admin users API client in `frontend/src/services/admin/adminUserService.ts`
- [ ] T113 [US5] [FE-ADMIN] Create Admin user management page in `frontend/src/pages/admin/AdminUsersPage.tsx`

## Phase 13: Admin Tour / Category Management (US5)

- [x] T114 [US5] [BE-ADMIN] Implement Admin Tour operations in `backend/src/main/java/com/sunbooking/service/AdminTourService.java`
- [x] T115 [US5] [BE-ADMIN] Implement `AdminTourController` in `backend/src/main/java/com/sunbooking/controller/admin/AdminTourController.java`
- [x] T116 [US5] [BE-ADMIN] Implement `AdminCategoryController` in `backend/src/main/java/com/sunbooking/controller/admin/AdminCategoryController.java`
- [ ] T117 [P] [US5] [FE-ADMIN] Implement admin tours API client in `frontend/src/services/admin/adminTourService.ts`
- [ ] T118 [P] [US5] [FE-ADMIN] Implement admin categories API client in `frontend/src/services/admin/adminCategoryService.ts`
- [ ] T119 [US5] [FE-ADMIN] Create Admin tours page in `frontend/src/pages/admin/AdminToursPage.tsx`
- [ ] T120 [US5] [FE-ADMIN] Create Admin categories page in `frontend/src/pages/admin/AdminCategoriesPage.tsx`

## Phase 14: Admin Booking Management (US5)

- [x] T121 [US5] [BE-ADMIN] Implement Admin Booking operations in `backend/src/main/java/com/sunbooking/service/AdminBookingService.java`
- [x] T122 [US5] [BE-ADMIN] Implement `AdminBookingController` in `backend/src/main/java/com/sunbooking/controller/admin/AdminBookingController.java`
- [ ] T123 [P] [US5] [FE-ADMIN] Implement admin bookings API client in `frontend/src/services/admin/adminBookingService.ts`
- [ ] T124 [US5] [FE-ADMIN] Create Admin bookings page in `frontend/src/pages/admin/AdminBookingsPage.tsx`

## Phase 15: Admin Review Management (US5)

- [ ] T125 [US5] [BE-ADMIN] Implement Admin Review read and delete operations in `backend/src/main/java/com/sunbooking/service/AdminReviewService.java`
- [ ] T126 [US5] [BE-ADMIN] Implement `AdminReviewController` in `backend/src/main/java/com/sunbooking/controller/admin/AdminReviewController.java`
- [ ] T127 [P] [US5] [FE-ADMIN] Implement admin reviews API client in `frontend/src/services/admin/adminReviewService.ts`
- [ ] T128 [US5] [FE-ADMIN] Create Admin reviews page in `frontend/src/pages/admin/AdminReviewsPage.tsx`

## Phase 16: Admin Revenue (US5)

- [ ] T129 [US5] [BE-ADMIN] Implement Revenue logic in `backend/src/main/java/com/sunbooking/service/RevenueService.java`
- [ ] T130 [US5] [BE-ADMIN] Implement `RevenueController` in `backend/src/main/java/com/sunbooking/controller/admin/RevenueController.java`
- [ ] T131 [P] [US5] [FE-ADMIN] Implement admin revenue API client in `frontend/src/services/admin/adminRevenueService.ts`
- [ ] T132 [US5] [FE-ADMIN] Create Admin revenue page in `frontend/src/pages/admin/AdminRevenuePage.tsx`

## Phase 17: Integration / End-to-End Testing

- [ ] T133 [P] [TEST] Write unit tests for booking capacity limits in `backend/src/test/java/com/sunbooking/service/CapacityServiceTest.java`
- [ ] T134 [P] [TEST] Write unit tests for reservation expiration logic in `backend/src/test/java/com/sunbooking/service/ReservationCleanupTest.java`
- [ ] T135 [TEST] Write concurrency / overbooking tests in `backend/src/test/java/com/sunbooking/service/BookingConcurrencyTest.java`
- [ ] T136 [TEST] Write unit tests for duplicate webhook and idempotency in `backend/src/test/java/com/sunbooking/service/PaymentConfirmationServiceTest.java`
- [ ] T137 [TEST] Write unit tests for invalid or unmatched webhook payloads in `backend/src/test/java/com/sunbooking/service/PaymentWebhookServiceTest.java`
- [ ] T138 [TEST] Write unit tests for webhook received after reservation expiration in `backend/src/test/java/com/sunbooking/service/PaymentConfirmationExpirationTest.java`
- [ ] T139 [TEST] Write unit tests verifying successful payment confirms booking in `backend/src/test/java/com/sunbooking/service/BookingServicePaymentSuccessTest.java`
- [ ] T140 [TEST] Write unit tests verifying reserved capacity becomes confirmed capacity in `backend/src/test/java/com/sunbooking/service/CapacityServiceConfirmationTest.java`
- [ ] T141 [TEST] Write SePay Webhook integration tests with mock payload in `backend/src/test/java/com/sunbooking/controller/PaymentWebhookIntegrationTest.java`
