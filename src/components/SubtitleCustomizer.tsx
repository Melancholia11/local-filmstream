import { useState } from "react";
import { X, Type, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubtitleSettings {
  fontSize: number;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
}

interface SubtitleCustomizerProps {
  settings: SubtitleSettings;
  onSettingsChange: (settings: SubtitleSettings) => void;
  onClose: () => void;
}

export const SubtitleCustomizer = ({ settings, onSettingsChange, onClose }: SubtitleCustomizerProps) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSettingChange = (key: keyof SubtitleSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const backgroundColors = [
    { name: "Hitam Semi-transparan", value: "rgba(0, 0, 0, 0.7)" },
    { name: "Hitam Solid", value: "rgba(0, 0, 0, 1)" },
    { name: "Putih Semi-transparan", value: "rgba(255, 255, 255, 0.7)" },
    { name: "Biru Semi-transparan", value: "rgba(59, 130, 246, 0.7)" },
    { name: "Tanpa Background", value: "transparent" },
  ];

  const textColors = [
    { name: "Putih", value: "#ffffff" },
    { name: "Hitam", value: "#000000" },
    { name: "Kuning", value: "#fbbf24" },
    { name: "Biru", value: "#3b82f6" },
    { name: "Merah", value: "#ef4444" },
  ];

  const fontFamilies = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Georgia",
    "Comic Sans MS",
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Type className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Kustomisasi Subtitle</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-8">
          {/* Preview */}
          <div className="bg-black/50 rounded-lg p-6 text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Preview</h3>
            <div
              className="inline-block px-4 py-2 rounded-lg subtitle-text"
              style={{
                fontSize: `${localSettings.fontSize}px`,
                fontFamily: localSettings.fontFamily,
                backgroundColor: localSettings.backgroundColor,
                color: localSettings.textColor,
              }}
            >
              Contoh teks subtitle
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Ukuran Font: {localSettings.fontSize}px</Label>
            <Slider
              value={[localSettings.fontSize]}
              onValueChange={([value]) => handleSettingChange('fontSize', value)}
              min={12}
              max={48}
              step={1}
              className="w-full"
            />
          </div>

          {/* Font Family */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Jenis Font</Label>
            <Select
              value={localSettings.fontFamily}
              onValueChange={(value) => handleSettingChange('fontFamily', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Text Color */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Warna Teks
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {textColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleSettingChange('textColor', color.value)}
                  className={`p-3 rounded-lg border-2 smooth-transition hover:scale-105 ${
                    localSettings.textColor === color.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full mx-auto mb-2 border border-border"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs font-medium">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Warna Background</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {backgroundColors.map((bg) => (
                <button
                  key={bg.value}
                  onClick={() => handleSettingChange('backgroundColor', bg.value)}
                  className={`p-3 rounded-lg border-2 smooth-transition hover:scale-105 text-left ${
                    localSettings.backgroundColor === bg.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: bg.value === 'transparent' ? '#ccc' : bg.value }}
                    />
                    <span className="text-sm font-medium">{bg.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
            Terapkan
          </Button>
        </div>
      </div>
    </div>
  );
};