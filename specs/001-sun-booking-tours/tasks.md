# Implementation Tasks: 001-sun-booking-tours

## Phase 1: Setup

- [x] T001 [P] [CONFIG] Initialize React frontend project with Vite and Tailwind in `frontend/`
- [x] T002 [P] [CONFIG] Initialize Spring Boot backend project in `backend/`
- [x] T003 [CONFIG] Configure database connection in `backend/src/main/resources/application.yml`
- [x] T004 [DB] Run baseline database schema from `database/schema.sql`

## Phase 2: Shared Backend Foundation

- [x] T005 [P] [CONFIG] Setup global exception handler in `backend/src/main/java/com/sunbooking/global/exception/GlobalExceptionHandler.java`
- [x] T006 [P] [SECURITY] Setup JWT utility class in `backend/src/main/java/com/sunbooking/global/security/JwtUtils.java`
- [x] T007 [SECURITY] Setup Spring Security configuration in `backend/src/main/java/com/sunbooking/global/security/SecurityConfig.java`
- [x] T008 [P] [BE-AUTH] Create BaseEntity in `backend/src/main/java/com/sunbooking/global/common/BaseEntity.java`

## Phase 3: Authentication (US1)

- [x] T009 [P] [US1] [BE-AUTH] Create `User` entity in `backend/src/main/java/com/sunbooking/domain/user/entity/User.java`
- [x] T010 [P] [US1] [BE-AUTH] Create `SocialAccount` entity in `backend/src/main/java/com/sunbooking/domain/user/entity/SocialAccount.java`
- [x] T011 [P] [US1] [BE-AUTH] Create auth request/response DTOs in `backend/src/main/java/com/sunbooking/domain/user/dto/`
- [x] T012 [US1] [BE-AUTH] Create `UserRepository` in `backend/src/main/java/com/sunbooking/domain/user/repository/UserRepository.java`
- [x] T013 [US1] [BE-AUTH] Create `SocialAccountRepository` in `backend/src/main/java/com/sunbooking/domain/user/repository/SocialAccountRepository.java`
- [x] T014 [US1] [BE-AUTH] Implement registration and login in `backend/src/main/java/com/sunbooking/domain/user/service/AuthService.java`
- [x] T015 [US1] [BE-AUTH] Implement social login in `backend/src/main/java/com/sunbooking/domain/user/service/SocialAuthService.java`
- [x] T016 [US1] [BE-AUTH] Implement auth APIs in `backend/src/main/java/com/sunbooking/domain/user/controller/AuthController.java`
- [x] T017 [P] [US1] [FE-AUTH] Setup authStore for frontend state in `frontend/src/features/auth/store/authStore.ts`
- [x] T018 [US1] [FE-AUTH] Implement auth API client in `frontend/src/features/auth/services/authService.ts`
- [x] T019 [P] [US1] [FE-AUTH] Create Login page in `frontend/src/features/auth/pages/LoginPage.tsx`
- [x] T020 [P] [US1] [FE-AUTH] Create Register page in `frontend/src/features/auth/pages/RegisterPage.tsx`

## Phase 4: User Profile (US1)

- [x] T021 [P] [US1] [BE-USER] Create user profile DTOs in `backend/src/main/java/com/sunbooking/domain/user/dto/`
- [x] T022 [US1] [BE-USER] Implement profile management in `backend/src/main/java/com/sunbooking/domain/user/service/UserService.java`
- [x] T023 [US1] [BE-USER] Implement user profile API in `backend/src/main/java/com/sunbooking/domain/user/controller/UserController.java`
- [x] T024 [P] [US1] [FE-USER] Implement user API client in `frontend/src/features/user/services/userService.ts`
- [x] T025 [US1] [FE-USER] Create Profile page in `frontend/src/features/user/pages/ProfilePage.tsx`

## Phase 5: Tour / Category (US2)

- [x] T026 [P] [US2] [BE-CATEGORY] Create `Category` entity in `backend/src/main/java/com/sunbooking/domain/tour/entity/Category.java`
- [x] T027 [P] [US2] [BE-TOUR] Create `Tour` entity in `backend/src/main/java/com/sunbooking/domain/tour/entity/Tour.java`
- [x] T028 [P] [US2] [BE-TOUR] Create `TourDeparture` entity in `backend/src/main/java/com/sunbooking/domain/tour/entity/TourDeparture.java`
- [x] T029 [P] [US2] [BE-TOUR] Create `TourImage` entity in `backend/src/main/java/com/sunbooking/domain/tour/entity/TourImage.java`
- [x] T030 [P] [US2] [BE-CATEGORY] Create `CategoryRepository` in `backend/src/main/java/com/sunbooking/domain/tour/repository/CategoryRepository.java`
- [x] T031 [P] [US2] [BE-TOUR] Create `TourRepository` in `backend/src/main/java/com/sunbooking/domain/tour/repository/TourRepository.java`
- [x] T032 [P] [US2] [BE-TOUR] Create `TourDepartureRepository` in `backend/src/main/java/com/sunbooking/domain/tour/repository/TourDepartureRepository.java`
- [x] T033 [P] [US2] [BE-TOUR] Create tour/category DTOs in `backend/src/main/java/com/sunbooking/domain/tour/dto/`
- [x] T034 [US2] [BE-CATEGORY] Implement category listing in `backend/src/main/java/com/sunbooking/domain/tour/service/CategoryService.java`
- [x] T035 [US2] [BE-TOUR] Implement tour search/details in `backend/src/main/java/com/sunbooking/domain/tour/service/TourService.java`
- [x] T036 [US2] [BE-CATEGORY] Implement category APIs in `backend/src/main/java/com/sunbooking/domain/tour/controller/CategoryController.java`
- [x] T037 [US2] [BE-TOUR] Implement tour public APIs in `backend/src/main/java/com/sunbooking/domain/tour/controller/TourController.java`
- [x] T038 [P] [US2] [FE-TOUR] Implement tour API client in `frontend/src/features/tour/services/tour.service.ts`
- [x] T039 [US2] [FE-TOUR] Create tour search page in `frontend/src/features/tour/pages/TourList.tsx`
- [x] T040 [US2] [FE-TOUR] Create tour details page in `frontend/src/features/tour/pages/TourDetail.tsx`



## Phase 7: Booking (US3)

- [x] T059 [P] [US3] [BE-BOOKING] Create `Booking` entity in `backend/src/main/java/com/sunbooking/domain/booking/entity/Booking.java`
- [x] T060 [P] [US3] [BE-BOOKING] Create `BookingTraveler` entity in `backend/src/main/java/com/sunbooking/domain/booking/entity/BookingTraveler.java`
- [x] T061 [P] [US3] [BE-BOOKING] Create booking request/response DTOs in `backend/src/main/java/com/sunbooking/domain/booking/dto/`
- [x] T062 [US3] [BE-BOOKING] Create `BookingRepository` in `backend/src/main/java/com/sunbooking/domain/booking/repository/BookingRepository.java`
- [x] T063 [US3] [BE-BOOKING] Implement booking orchestration and creation in `backend/src/main/java/com/sunbooking/domain/booking/service/BookingService.java`
- [x] T064 [US3] [BE-BOOKING] Implement booking checkout API in `backend/src/main/java/com/sunbooking/domain/booking/controller/BookingController.java`
- [x] T065 [US3] [BE-BOOKING] Implement booking history API in `backend/src/main/java/com/sunbooking/domain/booking/controller/BookingHistoryController.java`
- [ ] T066 [P] [US3] [FE-BOOKING] Implement booking API client in `frontend/src/features/booking/services/bookingService.ts`
- [ ] T067 [US3] [FE-BOOKING] Create booking form component in `frontend/src/features/booking/components/BookingForm.tsx`
- [ ] T068 [US3] [FE-BOOKING] Create user booking history page in `frontend/src/features/booking/pages/BookingHistoryPage.tsx`

## Phase 8: SePay / VietQR Payment (US3)

- [x] T069 [P] [US3] [BE-PAYMENT] Create `Payment` entity in `backend/src/main/java/com/sunbooking/domain/payment/entity/Payment.java`
- [x] T070 [P] [US3] [BE-PAYMENT] Create payment request/response DTOs in `backend/src/main/java/com/sunbooking/domain/payment/dto/`
- [x] T071 [US3] [BE-PAYMENT] Create `PaymentRepository` in `backend/src/main/java/com/sunbooking/domain/payment/repository/PaymentRepository.java`
- [x] T072 [US3] [BE-PAYMENT] Setup SePay configuration in `backend/src/main/java/com/sunbooking/config/SePayConfig.java`
- [x] T073 [US3] [BE-PAYMENT] Implement payment initialization service (QR info generation) in `backend/src/main/java/com/sunbooking/domain/payment/service/PaymentService.java`
- [x] T074 [US3] [BE-PAYMENT] Implement atomic capacity reserve, confirm, release, and availability validation in `backend/src/main/java/com/sunbooking/domain/tour/service/CapacityService.java`
- [x] T075 [US3] [BE-PAYMENT] Implement scheduled reservation cleanup (cron) to detect expired reservations and invoke release logic in `backend/src/main/java/com/sunbooking/domain/payment/scheduler/ReservationCleanupScheduler.java`
- [x] T076 [P] [US3] [BE-PAYMENT] Create SePay webhook request DTO in `backend/src/main/java/com/sunbooking/domain/payment/dto/SePayWebhookRequest.java`
- [x] T077 [US3] [BE-PAYMENT] Implement SePay webhook authentication/verification in `backend/src/main/java/com/sunbooking/domain/payment/service/PaymentWebhookService.java`
- [x] T078 [US3] [BE-PAYMENT] Implement webhook transaction matching, idempotency, and capacity confirmation in `backend/src/main/java/com/sunbooking/domain/payment/service/PaymentConfirmationService.java`
- [x] T079 [US3] [BE-PAYMENT] Implement SePay webhook endpoint in `backend/src/main/java/com/sunbooking/domain/payment/controller/PaymentWebhookController.java`
- [x] T080 [US3] [BE-PAYMENT] Implement payment status query API in `backend/src/main/java/com/sunbooking/domain/payment/controller/PaymentController.java`
- [x] T081 [P] [US3] [FE-PAYMENT] Implement payment API client in `frontend/src/features/payment/services/paymentService.ts`
- [x] T082 [US3] [FE-PAYMENT] Create VietQR checkout page in `frontend/src/features/payment/pages/VietQrCheckoutPage.tsx`
- [x] T083 [US3] [FE-PAYMENT] Implement payment countdown frontend in `frontend/src/features/payment/components/PaymentCountdown.tsx`
- [x] T084 [US3] [FE-PAYMENT] Create payment success/failure feedback pages in `frontend/src/features/payment/pages/PaymentResultPage.tsx`

## Phase 9: Reviews / Rating (US4)

- [x] T085 [P] [US4] [BE-REVIEW] Create `Review` entity in `backend/src/main/java/com/sunbooking/domain/review/entity/Review.java`
- [x] T086 [P] [US4] [BE-REVIEW] Create `ReviewImage` entity in `backend/src/main/java/com/sunbooking/domain/review/entity/ReviewImage.java`
- [x] T087 [P] [US4] [BE-REVIEW] Create review DTOs in `backend/src/main/java/com/sunbooking/domain/review/dto/`
- [x] T088 [US4] [BE-REVIEW] Create `ReviewRepository` in `backend/src/main/java/com/sunbooking/domain/review/repository/ReviewRepository.java`
- [x] T089 [US4] [BE-REVIEW] Implement review submission and validation in `backend/src/main/java/com/sunbooking/domain/review/service/ReviewService.java`
- [x] T090 [US4] [BE-REVIEW] Implement review APIs in `backend/src/main/java/com/sunbooking/domain/review/controller/ReviewController.java`
- [X] T091 [P] [US4] [FE-REVIEW] Implement review API client in `frontend/src/services/reviewService.ts`
- [X] T092 [P] [US4] [FE-REVIEW] Create review submission form in `frontend/src/components/reviews/ReviewForm.tsx`
- [X] T093 [US4] [FE-REVIEW] Create review list component in `frontend/src/components/reviews/ReviewList.tsx`

## Phase 10: Comments / Replies / Likes (US4)

- [x] T094 [P] [US4] [BE-COMMENT] Create `Comment` entity in `backend/src/main/java/com/sunbooking/domain/review/entity/Comment.java`
- [x] T095 [P] [US4] [BE-COMMENT] Create `ReviewLike` entity in `backend/src/main/java/com/sunbooking/domain/review/entity/ReviewLike.java`
- [x] T096 [P] [US4] [BE-COMMENT] Create comment/like DTOs in `backend/src/main/java/com/sunbooking/domain/review/dto/`
- [x] T097 [US4] [BE-COMMENT] Create `CommentRepository` in `backend/src/main/java/com/sunbooking/domain/review/repository/CommentRepository.java`
- [x] T098 [US4] [BE-COMMENT] Create `ReviewLikeRepository` in `backend/src/main/java/com/sunbooking/domain/review/repository/ReviewLikeRepository.java`
- [x] T099 [US4] [BE-COMMENT] Implement comment and reply logic in `backend/src/main/java/com/sunbooking/domain/review/service/CommentService.java`
- [x] T100 [US4] [BE-COMMENT] Implement like toggle logic in `backend/src/main/java/com/sunbooking/domain/review/service/LikeService.java`
- [x] T101 [US4] [BE-COMMENT] Implement comment APIs in `backend/src/main/java/com/sunbooking/domain/review/controller/CommentController.java`
- [x] T102 [US4] [BE-COMMENT] Implement like APIs in `backend/src/main/java/com/sunbooking/domain/review/controller/LikeController.java`
- [X] T103 [P] [US4] [FE-REVIEW] Implement comment and like API client in `frontend/src/services/commentService.ts`
- [X] T104 [P] [US4] [FE-REVIEW] Create comment thread UI in `frontend/src/components/reviews/CommentThread.tsx`
- [X] T105 [P] [US4] [FE-REVIEW] Create reply input UI in `frontend/src/components/reviews/ReplyInput.tsx`
- [X] T106 [P] [US4] [FE-REVIEW] Create like button UI in `frontend/src/components/reviews/LikeButton.tsx`

## Phase 11: Admin Frontend Foundation (US5)

- [x] T107 [P] [US5] [FE-ADMIN] Create Admin shared layout in `frontend/src/pages/admin/AdminLayout.tsx`
- [x] T108 [P] [US5] [FE-ADMIN] Create Admin sidebar/navigation in `frontend/src/pages/admin/AdminLayout.tsx`
- [x] T109 [US5] [FE-ADMIN] Create Admin dashboard home page in `frontend/src/pages/admin/AdminDashboardPage.tsx`

## Phase 12: Admin User Management (US5)

- [x] T110 [US5] [BE-ADMIN] Implement Admin User operations in `backend/src/main/java/com/sunbooking/domain/user/service/admin/AdminUserService.java`
- [x] T111 [US5] [BE-ADMIN] Implement `AdminUserController` in `backend/src/main/java/com/sunbooking/domain/user/controller/admin/AdminUserController.java`
- [x] T112 [P] [US5] [FE-ADMIN] Implement admin users API client in `frontend/src/features/user/services/adminUserService.ts`
- [x] T113 [US5] [FE-ADMIN] Create Admin user management page in `frontend/src/pages/admin/users/AdminManageUsersPage.tsx`

## Phase 13: Admin Tour / Category Management (US5)

- [x] T114 [US5] [BE-ADMIN] Implement Admin Tour operations in `backend/src/main/java/com/sunbooking/domain/tour/service/AdminTourService.java`
- [x] T115 [US5] [BE-ADMIN] Implement `AdminTourController` in `backend/src/main/java/com/sunbooking/domain/tour/controller/admin/AdminTourController.java`
- [x] T116 [US5] [BE-ADMIN] Implement `AdminCategoryController` in `backend/src/main/java/com/sunbooking/domain/tour/controller/admin/AdminCategoryController.java`
- [x] T117 [P] [US5] [FE-ADMIN] Implement admin tours API client in `frontend/src/services/adminTourService.ts`
- [x] T118 [P] [US5] [FE-ADMIN] Implement admin categories API client in `frontend/src/services/categoryService.ts`
- [x] T119 [US5] [FE-ADMIN] Create Admin tours page in `frontend/src/pages/admin/tour/AdminToursPage.tsx`
- [x] T120 [US5] [FE-ADMIN] Create Admin categories page in `frontend/src/pages/admin/category/AdminCategoriesPage.tsx`

## Phase 14: Admin Booking Management (US5)
# Implementation Tasks: 001-sun-booking-tours

## Phase 1: Setup

- [x] T001 [P] [CONFIG] Initialize React frontend project with Vite and Tailwind in `frontend/`
- [x] T002 [P] [CONFIG] Initialize Spring Boot backend project in `backend/`
- [x] T003 [CONFIG] Configure database connection in `backend/src/main/resources/application.yml`
- [x] T004 [DB] Run baseline database schema from `database/schema.sql`

## Phase 2: Shared Backend Foundation

- [x] T005 [P] [CONFIG] Setup global exception handler in `backend/src/main/java/com/sunbooking/global/exception/GlobalExceptionHandler.java`
- [x] T006 [P] [SECURITY] Setup JWT utility class in `backend/src/main/java/com/sunbooking/global/security/JwtUtils.java`
- [x] T007 [SECURITY] Setup Spring Security configuration in `backend/src/main/java/com/sunbooking/global/security/SecurityConfig.java`
- [x] T008 [P] [BE-AUTH] Create BaseEntity in `backend/src/main/java/com/sunbooking/global/common/BaseEntity.java`

## Phase 3: Authentication (US1)

- [x] T009 [P] [US1] [BE-AUTH] Create `User` entity in `backend/src/main/java/com/sunbooking/domain/user/entity/User.java`
- [x] T010 [P] [US1] [BE-AUTH] Create `SocialAccount` entity in `backend/src/main/java/com/sunbooking/domain/user/entity/SocialAccount.java`
- [x] T011 [P] [US1] [BE-AUTH] Create auth request/response DTOs in `backend/src/main/java/com/sunbooking/domain/user/dto/`
- [x] T012 [US1] [BE-AUTH] Create `UserRepository` in `backend/src/main/java/com/sunbooking/domain/user/repository/UserRepository.java`
- [x] T013 [US1] [BE-AUTH] Create `SocialAccountRepository` in `backend/src/main/java/com/sunbooking/domain/user/repository/SocialAccountRepository.java`
- [x] T014 [US1] [BE-AUTH] Implement registration and login in `backend/src/main/java/com/sunbooking/domain/user/service/AuthService.java`
- [x] T015 [US1] [BE-AUTH] Implement social login in `backend/src/main/java/com/sunbooking/domain/user/service/SocialAuthService.java`
- [x] T016 [US1] [BE-AUTH] Implement auth APIs in `backend/src/main/java/com/sunbooking/domain/user/controller/AuthController.java`
- [x] T017 [P] [US1] [FE-AUTH] Setup authStore for frontend state in `frontend/src/features/auth/store/authStore.ts`
- [x] T018 [US1] [FE-AUTH] Implement auth API client in `frontend/src/features/auth/services/authService.ts`
- [x] T019 [P] [US1] [FE-AUTH] Create Login page in `frontend/src/features/auth/pages/LoginPage.tsx`
- [x] T020 [P] [US1] [FE-AUTH] Create Register page in `frontend/src/features/auth/pages/RegisterPage.tsx`

## Phase 4: User Profile (US1)

- [x] T021 [P] [US1] [BE-USER] Create user profile DTOs in `backend/src/main/java/com/sunbooking/domain/user/dto/`
- [x] T022 [US1] [BE-USER] Implement profile management in `backend/src/main/java/com/sunbooking/domain/user/service/UserService.java`
- [x] T023 [US1] [BE-USER] Implement user profile API in `backend/src/main/java/com/sunbooking/domain/user/controller/UserController.java`
- [x] T024 [P] [US1] [FE-USER] Implement user API client in `frontend/src/features/user/services/userService.ts`
- [x] T025 [US1] [FE-USER] Create Profile page in `frontend/src/features/user/pages/ProfilePage.tsx`

## Phase 5: Tour / Category (US2)

- [x] T026 [P] [US2] [BE-CATEGORY] Create `Category` entity in `backend/src/main/java/com/sunbooking/domain/tour/entity/Category.java`
- [x] T027 [P] [US2] [BE-TOUR] Create `Tour` entity in `backend/src/main/java/com/sunbooking/domain/tour/entity/Tour.java`
- [x] T028 [P] [US2] [BE-TOUR] Create `TourDeparture` entity in `backend/src/main/java/com/sunbooking/domain/tour/entity/TourDeparture.java`
- [x] T029 [P] [US2] [BE-TOUR] Create `TourImage` entity in `backend/src/main/java/com/sunbooking/domain/tour/entity/TourImage.java`
- [x] T030 [P] [US2] [BE-CATEGORY] Create `CategoryRepository` in `backend/src/main/java/com/sunbooking/domain/tour/repository/CategoryRepository.java`
- [x] T031 [P] [US2] [BE-TOUR] Create `TourRepository` in `backend/src/main/java/com/sunbooking/domain/tour/repository/TourRepository.java`
- [x] T032 [P] [US2] [BE-TOUR] Create `TourDepartureRepository` in `backend/src/main/java/com/sunbooking/domain/tour/repository/TourDepartureRepository.java`
- [x] T033 [P] [US2] [BE-TOUR] Create tour/category DTOs in `backend/src/main/java/com/sunbooking/domain/tour/dto/`
- [x] T034 [US2] [BE-CATEGORY] Implement category listing in `backend/src/main/java/com/sunbooking/domain/tour/service/CategoryService.java`
- [x] T035 [US2] [BE-TOUR] Implement tour search/details in `backend/src/main/java/com/sunbooking/domain/tour/service/TourService.java`
- [x] T036 [US2] [BE-CATEGORY] Implement category APIs in `backend/src/main/java/com/sunbooking/domain/tour/controller/CategoryController.java`
- [x] T037 [US2] [BE-TOUR] Implement tour public APIs in `backend/src/main/java/com/sunbooking/domain/tour/controller/TourController.java`
- [x] T038 [P] [US2] [FE-TOUR] Implement tour API client in `frontend/src/features/tour/services/tour.service.ts`
- [x] T039 [US2] [FE-TOUR] Create tour search page in `frontend/src/features/tour/pages/TourList.tsx`
- [x] T040 [US2] [FE-TOUR] Create tour details page in `frontend/src/features/tour/pages/TourDetail.tsx`



## Phase 7: Booking (US3)

- [x] T059 [P] [US3] [BE-BOOKING] Create `Booking` entity in `backend/src/main/java/com/sunbooking/domain/booking/entity/Booking.java`
- [x] T060 [P] [US3] [BE-BOOKING] Create `BookingTraveler` entity in `backend/src/main/java/com/sunbooking/domain/booking/entity/BookingTraveler.java`
- [x] T061 [P] [US3] [BE-BOOKING] Create booking request/response DTOs in `backend/src/main/java/com/sunbooking/domain/booking/dto/`
- [x] T062 [US3] [BE-BOOKING] Create `BookingRepository` in `backend/src/main/java/com/sunbooking/domain/booking/repository/BookingRepository.java`
- [x] T063 [US3] [BE-BOOKING] Implement booking orchestration and creation in `backend/src/main/java/com/sunbooking/domain/booking/service/BookingService.java`
- [x] T064 [US3] [BE-BOOKING] Implement booking checkout API in `backend/src/main/java/com/sunbooking/domain/booking/controller/BookingController.java`
- [x] T065 [US3] [BE-BOOKING] Implement booking history API in `backend/src/main/java/com/sunbooking/domain/booking/controller/BookingHistoryController.java`
- [ ] T066 [P] [US3] [FE-BOOKING] Implement booking API client in `frontend/src/features/booking/services/bookingService.ts`
- [ ] T067 [US3] [FE-BOOKING] Create booking form component in `frontend/src/features/booking/components/BookingForm.tsx`
- [ ] T068 [US3] [FE-BOOKING] Create user booking history page in `frontend/src/features/booking/pages/BookingHistoryPage.tsx`

## Phase 8: SePay / VietQR Payment (US3)

- [x] T069 [P] [US3] [BE-PAYMENT] Create `Payment` entity in `backend/src/main/java/com/sunbooking/domain/payment/entity/Payment.java`
- [x] T070 [P] [US3] [BE-PAYMENT] Create payment request/response DTOs in `backend/src/main/java/com/sunbooking/domain/payment/dto/`
- [x] T071 [US3] [BE-PAYMENT] Create `PaymentRepository` in `backend/src/main/java/com/sunbooking/domain/payment/repository/PaymentRepository.java`
- [x] T072 [US3] [BE-PAYMENT] Setup SePay configuration in `backend/src/main/java/com/sunbooking/config/SePayConfig.java`
- [x] T073 [US3] [BE-PAYMENT] Implement payment initialization service (QR info generation) in `backend/src/main/java/com/sunbooking/domain/payment/service/PaymentService.java`
- [x] T074 [US3] [BE-PAYMENT] Implement atomic capacity reserve, confirm, release, and availability validation in `backend/src/main/java/com/sunbooking/domain/tour/service/CapacityService.java`
- [x] T075 [US3] [BE-PAYMENT] Implement scheduled reservation cleanup (cron) to detect expired reservations and invoke release logic in `backend/src/main/java/com/sunbooking/domain/payment/scheduler/ReservationCleanupScheduler.java`
- [x] T076 [P] [US3] [BE-PAYMENT] Create SePay webhook request DTO in `backend/src/main/java/com/sunbooking/domain/payment/dto/SePayWebhookRequest.java`
- [x] T077 [US3] [BE-PAYMENT] Implement SePay webhook authentication/verification in `backend/src/main/java/com/sunbooking/domain/payment/service/PaymentWebhookService.java`
- [x] T078 [US3] [BE-PAYMENT] Implement webhook transaction matching, idempotency, and capacity confirmation in `backend/src/main/java/com/sunbooking/domain/payment/service/PaymentConfirmationService.java`
- [x] T079 [US3] [BE-PAYMENT] Implement SePay webhook endpoint in `backend/src/main/java/com/sunbooking/domain/payment/controller/PaymentWebhookController.java`
- [x] T080 [US3] [BE-PAYMENT] Implement payment status query API in `backend/src/main/java/com/sunbooking/domain/payment/controller/PaymentController.java`
- [x] T081 [P] [US3] [FE-PAYMENT] Implement payment API client in `frontend/src/features/payment/services/paymentService.ts`
- [x] T082 [US3] [FE-PAYMENT] Create VietQR checkout page in `frontend/src/features/payment/pages/VietQrCheckoutPage.tsx`
- [x] T083 [US3] [FE-PAYMENT] Implement payment countdown frontend in `frontend/src/features/payment/components/PaymentCountdown.tsx`
- [x] T084 [US3] [FE-PAYMENT] Create payment success/failure feedback pages in `frontend/src/features/payment/pages/PaymentResultPage.tsx`

## Phase 9: Reviews / Rating (US4)

- [x] T085 [P] [US4] [BE-REVIEW] Create `Review` entity in `backend/src/main/java/com/sunbooking/domain/review/entity/Review.java`
- [x] T086 [P] [US4] [BE-REVIEW] Create `ReviewImage` entity in `backend/src/main/java/com/sunbooking/domain/review/entity/ReviewImage.java`
- [x] T087 [P] [US4] [BE-REVIEW] Create review DTOs in `backend/src/main/java/com/sunbooking/domain/review/dto/`
- [x] T088 [US4] [BE-REVIEW] Create `ReviewRepository` in `backend/src/main/java/com/sunbooking/domain/review/repository/ReviewRepository.java`
- [x] T089 [US4] [BE-REVIEW] Implement review submission and validation in `backend/src/main/java/com/sunbooking/domain/review/service/ReviewService.java`
- [x] T090 [US4] [BE-REVIEW] Implement review APIs in `backend/src/main/java/com/sunbooking/domain/review/controller/ReviewController.java`
- [X] T091 [P] [US4] [FE-REVIEW] Implement review API client in `frontend/src/services/reviewService.ts`
- [X] T092 [P] [US4] [FE-REVIEW] Create review submission form in `frontend/src/components/reviews/ReviewForm.tsx`
- [X] T093 [US4] [FE-REVIEW] Create review list component in `frontend/src/components/reviews/ReviewList.tsx`

## Phase 10: Comments / Replies / Likes (US4)

- [x] T094 [P] [US4] [BE-COMMENT] Create `Comment` entity in `backend/src/main/java/com/sunbooking/domain/review/entity/Comment.java`
- [x] T095 [P] [US4] [BE-COMMENT] Create `ReviewLike` entity in `backend/src/main/java/com/sunbooking/domain/review/entity/ReviewLike.java`
- [x] T096 [P] [US4] [BE-COMMENT] Create comment/like DTOs in `backend/src/main/java/com/sunbooking/domain/review/dto/`
- [x] T097 [US4] [BE-COMMENT] Create `CommentRepository` in `backend/src/main/java/com/sunbooking/domain/review/repository/CommentRepository.java`
- [x] T098 [US4] [BE-COMMENT] Create `ReviewLikeRepository` in `backend/src/main/java/com/sunbooking/domain/review/repository/ReviewLikeRepository.java`
- [x] T099 [US4] [BE-COMMENT] Implement comment and reply logic in `backend/src/main/java/com/sunbooking/domain/review/service/CommentService.java`
- [x] T100 [US4] [BE-COMMENT] Implement like toggle logic in `backend/src/main/java/com/sunbooking/domain/review/service/LikeService.java`
- [x] T101 [US4] [BE-COMMENT] Implement comment APIs in `backend/src/main/java/com/sunbooking/domain/review/controller/CommentController.java`
- [x] T102 [US4] [BE-COMMENT] Implement like APIs in `backend/src/main/java/com/sunbooking/domain/review/controller/LikeController.java`
- [X] T103 [P] [US4] [FE-REVIEW] Implement comment and like API client in `frontend/src/services/commentService.ts`
- [X] T104 [P] [US4] [FE-REVIEW] Create comment thread UI in `frontend/src/components/reviews/CommentThread.tsx`
- [X] T105 [P] [US4] [FE-REVIEW] Create reply input UI in `frontend/src/components/reviews/ReplyInput.tsx`
- [X] T106 [P] [US4] [FE-REVIEW] Create like button UI in `frontend/src/components/reviews/LikeButton.tsx`

## Phase 11: Admin Frontend Foundation (US5)

- [x] T107 [P] [US5] [FE-ADMIN] Create Admin shared layout in `frontend/src/pages/admin/AdminLayout.tsx`
- [x] T108 [P] [US5] [FE-ADMIN] Create Admin sidebar/navigation in `frontend/src/pages/admin/AdminLayout.tsx`
- [x] T109 [US5] [FE-ADMIN] Create Admin dashboard home page in `frontend/src/pages/admin/AdminDashboardPage.tsx`

## Phase 12: Admin User Management (US5)

- [x] T110 [US5] [BE-ADMIN] Implement Admin User operations in `backend/src/main/java/com/sunbooking/domain/user/service/admin/AdminUserService.java`
- [x] T111 [US5] [BE-ADMIN] Implement `AdminUserController` in `backend/src/main/java/com/sunbooking/domain/user/controller/admin/AdminUserController.java`
- [x] T112 [P] [US5] [FE-ADMIN] Implement admin users API client in `frontend/src/features/user/services/adminUserService.ts`
- [x] T113 [US5] [FE-ADMIN] Create Admin user management page in `frontend/src/pages/admin/users/AdminManageUsersPage.tsx`

## Phase 13: Admin Tour / Category Management (US5)

- [x] T114 [US5] [BE-ADMIN] Implement Admin Tour operations in `backend/src/main/java/com/sunbooking/domain/tour/service/AdminTourService.java`
- [x] T115 [US5] [BE-ADMIN] Implement `AdminTourController` in `backend/src/main/java/com/sunbooking/domain/tour/controller/admin/AdminTourController.java`
- [x] T116 [US5] [BE-ADMIN] Implement `AdminCategoryController` in `backend/src/main/java/com/sunbooking/domain/tour/controller/admin/AdminCategoryController.java`
- [x] T117 [P] [US5] [FE-ADMIN] Implement admin tours API client in `frontend/src/services/adminTourService.ts`
- [x] T118 [P] [US5] [FE-ADMIN] Implement admin categories API client in `frontend/src/services/categoryService.ts`
- [x] T119 [US5] [FE-ADMIN] Create Admin tours page in `frontend/src/pages/admin/tour/AdminToursPage.tsx`
- [x] T120 [US5] [FE-ADMIN] Create Admin categories page in `frontend/src/pages/admin/category/AdminCategoriesPage.tsx`

## Phase 14: Admin Booking Management (US5)

- [x] T121 [US5] [BE-ADMIN] Implement Admin Booking operations in `backend/src/main/java/com/sunbooking/domain/booking/service/admin/AdminBookingService.java`
- [x] T122 [US5] [BE-ADMIN] Implement `AdminBookingController` in `backend/src/main/java/com/sunbooking/domain/booking/controller/admin/AdminBookingController.java`
- [ ] T123 [P] [US5] [FE-ADMIN] Implement admin bookings API client in `frontend/src/services/adminBookingService.ts`
- [ ] T124 [US5] [FE-ADMIN] Create Admin bookings page in `frontend/src/pages/admin/bookings/AdminManageBookingRequestsPage.tsx`

## Phase 15: Admin Review Management (US5)

- [X] T125 [US5] [BE-ADMIN] Implement Admin Review read and delete operations in `backend/src/main/java/com/sunbooking/domain/review/service/admin/AdminReviewService.java`
- [X] T126 [US5] [BE-ADMIN] Implement `AdminReviewController` in `backend/src/main/java/com/sunbooking/domain/review/controller/admin/AdminReviewController.java`
- [X] T127 [P] [US5] [FE-ADMIN] Implement admin reviews API client in `frontend/src/services/adminReviewService.ts`
- [X] T128 [US5] [FE-ADMIN] Create Admin reviews page in `frontend/src/pages/admin/reviews/AdminManageReviewsPage.tsx`

## Phase 16: Admin Revenue (US5)

- [x] T129 [US5] [BE-ADMIN] Implement Revenue logic in `backend/src/main/java/com/sunbooking/domain/payment/service/RevenueService.java`
- [x] T130 [US5] [BE-ADMIN] Implement `RevenueController` in `backend/src/main/java/com/sunbooking/domain/payment/controller/admin/RevenueController.java`
- [ ] T131 [P] [US5] [FE-ADMIN] Implement admin revenue API client in `frontend/src/services/adminRevenueService.ts`
- [ ] T132 [US5] [FE-ADMIN] Create Admin revenue page in `frontend/src/pages/admin/revenue/AdminRevenuePage.tsx`

## Phase 17: Integration / End-to-End Testing

- [ ] T133 [P] [TEST] Write unit tests for booking capacity limits in `backend/src/test/java/com/sunbooking/domain/tour/service/CapacityServiceTest.java`
- [ ] T134 [P] [TEST] Write unit tests for reservation expiration logic in `backend/src/test/java/com/sunbooking/domain/payment/scheduler/ReservationCleanupSchedulerTest.java`
- [ ] T135 [TEST] Write concurrency / overbooking tests in `backend/src/test/java/com/sunbooking/domain/booking/service/BookingConcurrencyTest.java`
- [ ] T136 [TEST] Write unit tests for duplicate webhook and idempotency in `backend/src/test/java/com/sunbooking/domain/payment/service/PaymentConfirmationServiceTest.java`
- [ ] T137 [TEST] Write unit tests for invalid or unmatched webhook payloads in `backend/src/test/java/com/sunbooking/domain/payment/service/PaymentWebhookServiceTest.java`
- [ ] T138 [TEST] Write unit tests for webhook received after reservation expiration in `backend/src/test/java/com/sunbooking/domain/payment/service/PaymentConfirmationExpirationTest.java`
- [ ] T139 [TEST] Write unit tests verifying successful payment confirms booking in `backend/src/test/java/com/sunbooking/domain/booking/service/BookingServicePaymentSuccessTest.java`
- [ ] T140 [TEST] Write unit tests verifying reserved capacity becomes confirmed capacity in `backend/src/test/java/com/sunbooking/domain/tour/service/CapacityServiceConfirmationTest.java`
- [ ] T141 [TEST] Write SePay Webhook integration tests with mock payload in `backend/src/test/java/com/sunbooking/domain/payment/controller/PaymentWebhookIntegrationTest.java`
