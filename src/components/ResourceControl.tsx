import React from "react";
import { Info } from "lucide-react";

interface ResourceControlProps {
  resourceId: string; // id estable: water, light, nutrients, temperature, humidity, co2, energy
  name: string; // etiqueta mostrada (puede ser traducida)
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  info: string;
  onIncrease: (resource: string, amount: number) => void;
  onDecrease: (resource: string, amount: number) => void;
  gameState: string;
  showInfo: string | null;
  setShowInfo: (info: string | null) => void;
  disabled?: boolean;
}

const ResourceControl: React.FC<ResourceControlProps> = ({
  resourceId,
  name,
  value,
  icon: Icon,
  unit = "%",
  min = 0,
  max = 100,
  step = 5,
  info,
  onIncrease,
  onDecrease,
  gameState,
  showInfo,
  setShowInfo,
  disabled = false,
}) => {
  const displayValue = unit === "°C" ? value.toFixed(1) : Math.round(value);
  const percentage = ((value - min) / (max - min)) * 100;
  const resourceKey = resourceId;

  const getResourceColor = (value: number, resource: string) => {
    const optimalRanges: Record<
      string,
      { min: number; max: number; critical: { min: number; max: number } }
    > = {
      water: { min: 40, max: 70, critical: { min: 20, max: 90 } },
      light: { min: 60, max: 90, critical: { min: 30, max: 100 } },
      nutrients: { min: 45, max: 75, critical: { min: 25, max: 85 } },
      temperature: { min: 20, max: 24, critical: { min: 15, max: 28 } },
      humidity: { min: 50, max: 70, critical: { min: 30, max: 85 } },
      co2: { min: 40, max: 70, critical: { min: 20, max: 90 } },
    };

    const range = optimalRanges[resource];
    if (!range)
      return {
        bg: "bg-green-500",
        text: "text-green-400",
        border: "border-green-500",
        barBg: "bg-green-500",
      };

    if (value < range.critical.min || value > range.critical.max)
      return {
        bg: "bg-red-500",
        text: "text-red-400",
        border: "border-red-500",
        barBg: "bg-red-500",
      };
    if (value < range.min || value > range.max)
      return {
        bg: "bg-yellow-500",
        text: "text-yellow-400",
        border: "border-yellow-500",
        barBg: "bg-yellow-500",
      };
    return {
      bg: "bg-green-500",
      text: "text-green-400",
      border: "border-green-500",
      barBg: "bg-green-500",
    };
  };

  const getOptimalRange = (resource: string) => {
    const optimalRanges: Record<string, { min: number; max: number }> = {
      water: { min: 40, max: 70 },
      light: { min: 60, max: 90 },
      nutrients: { min: 45, max: 75 },
      temperature: { min: 20, max: 24 },
      humidity: { min: 50, max: 70 },
      co2: { min: 40, max: 70 },
    };
    return optimalRanges[resource] || { min: 0, max: 100 };
  };

  const getResourceTheme = (resource: string) => {
    const themes: Record<
      string,
      { nameColor: string; iconColor: string; bgGradient: string; glow: string }
    > = {
      water: {
        nameColor: "text-cyan-400",
        iconColor: "text-cyan-400",
        bgGradient: "from-blue-900/20 to-cyan-900/20",
        glow: "shadow-cyan-500/50",
      },
      light: {
        nameColor: "text-yellow-300",
        iconColor: "text-yellow-400",
        bgGradient: "from-yellow-900/20 to-amber-900/20",
        glow: "shadow-yellow-400/60",
      },
      nutrients: {
        nameColor: "text-lime-400",
        iconColor: "text-lime-500",
        bgGradient: "from-green-900/20 to-lime-900/20",
        glow: "shadow-lime-500/40",
      },
      temperature: {
        nameColor: "text-orange-400",
        iconColor: "text-orange-500",
        bgGradient: "from-red-900/20 to-orange-900/20",
        glow: "shadow-orange-500/50",
      },
      humidity: {
        nameColor: "text-blue-300",
        iconColor: "text-blue-400",
        bgGradient: "from-blue-900/20 to-sky-900/20",
        glow: "shadow-blue-400/40",
      },
      co2: {
        nameColor: "text-gray-300",
        iconColor: "text-gray-400",
        bgGradient: "from-gray-900/20 to-slate-900/20",
        glow: "shadow-gray-400/30",
      },
      energy: {
        nameColor: "text-yellow-400",
        iconColor: "text-yellow-500",
        bgGradient: "from-yellow-900/20 to-amber-900/20",
        glow: "shadow-yellow-500/60",
      },
    };
    return themes[resource] || themes.water;
  };

  const optimal = getOptimalRange(resourceKey);
  const optimalText =
    unit === "°C"
      ? `${optimal.min}-${optimal.max}`
      : `${optimal.min}-${optimal.max}`;
  const colors = getResourceColor(value, resourceKey);
  const theme = getResourceTheme(resourceKey);

  const isInOptimalRange = value >= optimal.min && value <= optimal.max;
  const showWarning = !isInOptimalRange;

  const isTemperature = resourceKey === "temperature";

  return (
    <div
      className={`bg-gradient-to-br ${
        theme.bgGradient
      } bg-gray-800 rounded-lg p-2 border-2 ${
        showWarning ? colors.border : "border-gray-700"
      } transition-all ${disabled ? "opacity-50" : ""}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Icon size={14} className={`${theme.iconColor} drop-shadow-lg`} />
          <span
            className={`text-sm font-bold ${theme.nameColor} drop-shadow-md`}
          >
            {name}
          </span>
        </div>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            setShowInfo(showInfo === name ? null : name);
          }}
          className="text-blue-400 hover:text-blue-300 p-0.5 rounded hover:bg-gray-700 transition-colors"
          type="button"
        >
          <Info size={10} />
        </button>
      </div>

      {showInfo === name && (
        <div className="text-xs bg-gray-900 p-1.5 rounded mb-1.5 text-gray-300 leading-tight border border-gray-700">
          {info}
        </div>
      )}

      {disabled && (
        <div className="text-xs bg-red-900 bg-opacity-50 p-1.5 rounded mb-1.5 text-red-300 text-center border border-red-700">
          Sin energia
        </div>
      )}

      <div className="flex gap-2 items-stretch">
        <div className="flex-1">
          <div className="text-center mb-1">
            <div
              className={`text-xs ${
                isInOptimalRange ? "text-green-400" : "text-gray-500"
              }`}
            >
              {optimalText}
              {unit}
            </div>
            <div className={`text-2xl font-bold ${colors.text} drop-shadow-lg`}>
              {displayValue}
              <span className="text-sm">{unit}</span>
            </div>
          </div>

          <div className="flex justify-center">
            {isTemperature ? (
              <div className="relative w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`absolute bottom-0 left-0 right-0 ${colors.barBg} transition-all duration-300 rounded-full shadow-lg ${theme.glow}`}
                  style={{ height: `${percentage}%`, width: "100%" }}
                ></div>
              </div>
            ) : (
              <div className="w-20 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 ${colors.barBg} transition-all duration-300 shadow-lg ${theme.glow}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              if (gameState === "playing" && !disabled) {
                onIncrease(resourceKey, step);
              }
            }}
            disabled={gameState !== "playing" || disabled}
            className="w-8 h-8 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded transition-colors select-none flex items-center justify-center text-lg shadow-lg"
            type="button"
          >
            +
          </button>

          <button
            onMouseDown={(e) => {
              e.preventDefault();
              if (gameState === "playing" && !disabled) {
                onDecrease(resourceKey, step);
              }
            }}
            disabled={gameState !== "playing" || disabled}
            className="w-8 h-8 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded transition-colors select-none flex items-center justify-center text-lg shadow-lg"
            type="button"
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceControl;
