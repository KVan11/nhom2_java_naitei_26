import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import FeaturedTours from "../components/FeaturedTours";
import CtaBanner from "../components/CtaBanner";
import { homeService } from "../services/home.service";
import type { HomeData } from "../services/home.service";

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    homeService.getHomeData().then(setData);
  }, []);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <HeroSection categories={data.categories} departuresList={data.departuresList} />
      <FeaturedTours tours={data.featuredTours} />
      <CtaBanner />
    </div>
  );
}
