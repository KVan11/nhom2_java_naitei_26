import { formatPrice } from "@/constants/mockData";
import type { Food } from "@/constants/mockData";

export default function FoodCard({ food }: { food: Food }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all flex h-[120px]">
      <div className="w-[120px] shrink-0">
        <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col justify-center flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-slate-900 text-[15px] truncate pr-2">{food.name}</h4>
          <span className="text-brand font-semibold text-[13px] whitespace-nowrap">{formatPrice(food.price)}</span>
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{food.description}</p>
      </div>
    </div>
  );
}
