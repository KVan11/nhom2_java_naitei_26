import { useState } from "react";
import { Camera, Check, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AvatarSelectorProps {
  avatar: string;
  onChange: (avatarUrl: string) => void;
  name: string;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
];

export function AvatarSelector({ avatar, onChange, name }: AvatarSelectorProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState(avatar);

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setShowUrlInput(false);
    }
  };

  const initialChar = name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Main Avatar Preview */}
      <div className="relative group">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-4xl font-bold transition-transform duration-300 group-hover:scale-105">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If image fails to load, clear it or show fallback character
                (e.target as HTMLImageElement).src = "";
              }}
            />
          ) : (
            initialChar
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="absolute bottom-0 right-0 p-2.5 bg-slate-950 text-white rounded-full shadow-md hover:bg-brand transition-colors duration-200"
          title="Đổi ảnh đại diện"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* URL Input Form */}
      {showUrlInput && (
        <form onSubmit={handleCustomUrlSubmit} className="w-full max-w-sm space-y-2.5 animate-fadeIn">
          <Label className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5" />
            Nhập liên kết ảnh (URL)
          </Label>
          <div className="flex gap-2">
            <Input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="rounded-xl flex-1 text-sm py-4 border-slate-200"
              required
            />
            <Button
              type="submit"
              className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-4 font-semibold text-xs"
            >
              Lưu
            </Button>
          </div>
        </form>
      )}

      {/* Presets Selection */}
      <div className="w-full max-w-md">
        <h4 className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
          Hoặc chọn ảnh đại diện có sẵn
        </h4>
        <div className="grid grid-cols-6 gap-3.5 justify-items-center">
          {PRESET_AVATARS.map((url, idx) => {
            const isSelected = avatar === url;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(url);
                  setCustomUrl(url);
                }}
                className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-200 scale-95 hover:scale-105 ${
                  isSelected
                    ? "border-brand ring-2 ring-brand/35 ring-offset-1"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                {isSelected && (
                  <div className="absolute inset-0 bg-brand/35 flex items-center justify-center text-white">
                    <Check className="w-5 h-5 stroke-[3px]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
