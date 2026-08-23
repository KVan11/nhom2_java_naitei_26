import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import MainLayout from "@/app/layouts/MainLayout";
import Home from "@/features/home/pages/Home";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import TourList from "@/features/tour/pages/TourList";
import TourDetail from "@/features/tour/pages/TourDetail";
import PlaceList from "@/features/place/pages/PlaceList";
import PlaceDetail from "@/features/place/pages/PlaceDetail";
import FoodListPage from "@/features/food/pages/FoodListPage";
import NewsListPage from "@/features/news/pages/NewsListPage";
import BookingHistoryPage from "@/features/booking/pages/BookingHistoryPage";
import ProfilePage from "@/features/user/pages/ProfilePage";
import { RouteMiddleware } from "@/app/middleware/RouteMiddleware";
import VietQrCheckoutPage from "@/features/payment/pages/VietQrCheckoutPage";
import PaymentResultPage from "@/features/payment/pages/PaymentResultPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "tours",
        element: <TourList />,
      },
      {
        path: "tours/:id",
        element: <TourDetail />,
      },
      {
        path: "places",
        element: <PlaceList />,
      },
      {
        path: "places/:id",
        element: <PlaceDetail />,
      },
      {
        path: "food",
        element: <FoodListPage />,
      },
      {
        path: "news",
        element: <NewsListPage />,
      },
      {
        path: "checkout/:bookingId", // Payment route with bookingId parameter
        element: (
            <RouteMiddleware type="auth">
              <VietQrCheckoutPage />
            </RouteMiddleware>
        ),
      },
      {
        path: "bookings",
        element: (
          <RouteMiddleware type="auth">
            <BookingHistoryPage />
          </RouteMiddleware>
        ),
      },
      {
        path: "profile",
        element: (
          <RouteMiddleware type="auth">
            <ProfilePage />
          </RouteMiddleware>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <RouteMiddleware type="auth">
        <AdminDashboardPage />
      </RouteMiddleware>
    ),
  },
  {
    path: "/login",
    element: (
      <RouteMiddleware type="guest">
        <LoginPage />
      </RouteMiddleware>
    ),
  },
  {
    path: "/register",
    element: (
      <RouteMiddleware type="guest">
        <RegisterPage />
      </RouteMiddleware>
    ),
  },
  {
    path: "payment/result",
    element: (
        <RouteMiddleware type="auth">
          <PaymentResultPage />
        </RouteMiddleware>
    ),
  },
]);
