import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  "data-testid"?: string;
}

const colorPresets = [
  "#22C55E", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F97316", // Orange
  "#EF4444", // Red
];

export default function ColorPicker({ value, onChange, "data-testid": testId }: ColorPickerProps) {
  const [hexValue, setHexValue] = useState(value);

  const handleColorChange = (color: string) => {
    setHexValue(color);
    onChange(color);
  };

  const handleHexChange = (hex: string) => {
    setHexValue(hex);
    if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
      onChange(hex);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-3">
        <div className="flex-1">
          <input
            type="color"
            value={value}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full h-10 border border-input rounded-md cursor-pointer"
            data-testid={testId}
          />
        </div>
        <Input
          value={hexValue}
          onChange={(e) => handleHexChange(e.target.value)}
          placeholder="#22C55E"
          className="flex-1"
          data-testid={`${testId}-hex`}
        />
      </div>
      
      {/* Color Presets */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Cores populares:</p>
        <div className="flex space-x-2">
          {colorPresets.map((color) => (
            <Button
              key={color}
              type="button"
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 border-2 border-white shadow-sm hover:scale-110 transition-transform rounded-full"
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
              data-testid={`color-preset-${color}`}
            >
              <span className="sr-only">Select {color}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
