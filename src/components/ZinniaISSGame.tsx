import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  AlertTriangle,
  Droplet,
  Sun,
  Leaf,
  Thermometer,
  Wind,
  Zap,
  Cloud,
} from "lucide-react";
import ResourceControl from "./ResourceControl";
import "./ZinniaISSGame.css";
import { useTranslation } from "react-i18next";

interface Event {
  message: string;
  time: number;
}

interface ActiveEvent {
  id: string;
  name: string;
  effect: string;
  change: number;
  duration: number;
  timeLeft: number;
}

interface StressFactors {
  [key: string]: "warning" | "critical";
}

const ZinniaISSGame: React.FC = () => {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<
    "menu" | "tutorial" | "playing" | "paused" | "won" | "lost"
  >("menu");
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("easy");
  const [time, setTime] = useState(0);
  const [orbit, setOrbit] = useState(0);
  const [isDaylight, setIsDaylight] = useState(true);

  const [growthStage, setGrowthStage] = useState<
    "seed" | "germination" | "seedling" | "vegetative" | "budding" | "flowering"
  >("seed");
  const [growthProgress, setGrowthProgress] = useState(0);
  const [plantHealth, setPlantHealth] = useState(100);

  const [water, setWater] = useState(50);
  const [light, setLight] = useState(50);
  const [nutrients, setNutrients] = useState(50);
  const [temperature, setTemperature] = useState(22);

  const [humidity, setHumidity] = useState(50);
  const [co2, setCo2] = useState(50);
  const [energy, setEnergy] = useState(100);

  const [events, setEvents] = useState<Event[]>([]);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [stressFactors, setStressFactors] = useState<StressFactors>({});
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [resourceAnimation, setResourceAnimation] = useState<string | null>(
    null
  );

  const gameLoopRef = useRef<number | null>(null);
  const orbitDuration = 15;

  const optimalRanges = {
    water: { min: 40, max: 70, critical: { min: 20, max: 90 } },
    light: { min: 60, max: 90, critical: { min: 30, max: 100 } },
    nutrients: { min: 45, max: 75, critical: { min: 25, max: 85 } },
    temperature: { min: 20, max: 24, critical: { min: 15, max: 28 } },
    humidity: { min: 50, max: 70, critical: { min: 30, max: 85 } },
    co2: { min: 40, max: 70, critical: { min: 20, max: 90 } },
  };

  const resourceInfo = {
    water: t("game.resourceInfo.water"),
    light: t("game.resourceInfo.light"),
    nutrients: t("game.resourceInfo.nutrients"),
    temperature: t("game.resourceInfo.temperature"),
    humidity: t("game.resourceInfo.humidity"),
    co2: t("game.resourceInfo.co2"),
    energy: t("game.resourceInfo.energy"),
  };

  const possibleEvents = {
    easy: [
      {
        id: "solar_flare",
        name: t("game.events.solar_flare"),
        effect: "light",
        change: -15,
        duration: 20,
      },
      {
        id: "temp_spike",
        name: t("game.events.temp_spike"),
        effect: "temperature",
        change: 3,
        duration: 15,
      },
      {
        id: "water_leak",
        name: t("game.events.water_leak"),
        effect: "water",
        change: -10,
        duration: 10,
      },
    ],
    hard: [
      {
        id: "solar_flare",
        name: t("game.events.solar_flare"),
        effect: "light",
        change: -15,
        duration: 20,
      },
      {
        id: "temp_spike",
        name: t("game.events.temp_spike"),
        effect: "temperature",
        change: 3,
        duration: 15,
      },
      {
        id: "water_leak",
        name: t("game.events.water_leak"),
        effect: "water",
        change: -10,
        duration: 10,
      },
      {
        id: "air_system",
        name: t("game.events.air_system"),
        effect: "co2",
        change: -20,
        duration: 25,
      },
      {
        id: "power_save",
        name: t("game.events.power_save"),
        effect: "energy",
        change: -30,
        duration: 30,
      },
      {
        id: "humidity_rise",
        name: t("game.events.humidity_rise"),
        effect: "humidity",
        change: 15,
        duration: 20,
      },
    ],
  };

  const startGame = (diff: "easy" | "hard") => {
    setDifficulty(diff);
    setGameState("tutorial");
    resetGame();
  };

  const resetGame = () => {
    setTime(0);
    setOrbit(0);
    setIsDaylight(true);
    setGrowthStage("seed");
    setGrowthProgress(0);
    setPlantHealth(100);
    setWater(50);
    setLight(50);
    setNutrients(50);
    setTemperature(22);
    setHumidity(50);
    setCo2(50);
    setEnergy(100);
    setEvents([]);
    setStressFactors({});
    setActiveEvent(null);
  };

  const startPlaying = () => {
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = setInterval(() => {
        setTime((t) => {
          const newTime = t + 0.1;

          const newOrbit = Math.floor(newTime / orbitDuration);
          if (newOrbit !== orbit) {
            setOrbit(newOrbit);
            setIsDaylight((prev) => !prev);
          }

          if (newTime >= 300) {
            if (growthStage === "flowering") {
              setGameState("won");
            } else {
              setGameState("lost");
            }
            return newTime;
          }

          return newTime;
        });

        updateGameState();
      }, 100);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, orbit, growthStage]);

  const updateGameState = () => {
    setWater((w) => Math.max(0, w - 0.08));
    setNutrients((n) => Math.max(0, n - 0.05));

    if (difficulty === "hard") {
      setCo2((c) => Math.max(0, c - 0.1));
      setEnergy((e) => Math.max(0, e - 0.06));
    }

    setLight((l) => {
      if (isDaylight) {
        return Math.min(100, l + 0.15);
      } else {
        return Math.max(0, l - 0.2);
      }
    });

    setTemperature((t) => {
      if (isDaylight) {
        return Math.min(30, t + 0.01);
      } else {
        return Math.max(15, t - 0.01);
      }
    });

    if (difficulty === "hard") {
      setHumidity((h) => {
        const waterEffect = (water - 50) * 0.002;
        const tempEffect = (temperature - 22) * -0.01;
        return Math.max(0, Math.min(100, h + waterEffect + tempEffect));
      });
    }

    updatePlantHealth();
    updateGrowthProgress();
    generateRandomEvents();
  };

  const updatePlantHealth = () => {
    let healthChange = 0;
    const newStress: StressFactors = {};

    const checkResource = (
      value: number,
      name: string,
      range: {
        min: number;
        max: number;
        critical: { min: number; max: number };
      }
    ) => {
      if (value < range.critical.min || value > range.critical.max) {
        healthChange -= 0.5;
        newStress[name] = "critical";
      } else if (value < range.min || value > range.max) {
        healthChange -= 0.1;
        newStress[name] = "warning";
      } else {
        healthChange += 0.05;
      }
    };

    checkResource(water, "water", optimalRanges.water);
    checkResource(light, "light", optimalRanges.light);
    checkResource(nutrients, "nutrients", optimalRanges.nutrients);
    checkResource(temperature, "temperature", optimalRanges.temperature);

    if (difficulty === "hard") {
      checkResource(humidity, "humidity", optimalRanges.humidity);
      checkResource(co2, "co2", optimalRanges.co2);

      if (energy < 20) {
        healthChange -= 0.3;
        newStress.energy = "critical";
      }
    }

    setStressFactors(newStress);
    setPlantHealth((h) => Math.max(0, Math.min(100, h + healthChange)));
  };

  const updateGrowthProgress = () => {
    if (plantHealth > 30) {
      setGrowthProgress((p) => {
        const newProgress = p + 0.05;

        if (newProgress > 20 && growthStage === "seed") {
          setGrowthStage("germination");
          addEvent(t("game.events.germinationStarted"));
        } else if (newProgress > 35 && growthStage === "germination") {
          setGrowthStage("seedling");
          addEvent(t("game.events.seedlingEmerging"));
        } else if (newProgress > 55 && growthStage === "seedling") {
          setGrowthStage("vegetative");
          addEvent(t("game.events.vegetativePhase"));
        } else if (newProgress > 75 && growthStage === "vegetative") {
          setGrowthStage("budding");
          addEvent(t("game.events.buddingFormation"));
        } else if (newProgress > 95 && growthStage === "budding") {
          setGrowthStage("flowering");
          addEvent(t("game.events.floweringSuccess"));
        }

        return Math.min(100, newProgress);
      });
    }

    if (plantHealth <= 0) {
      setGameState("lost");
    }
  };

  const generateRandomEvents = () => {
    const eventChance = difficulty === "easy" ? 0.001 : 0.003;

    if (Math.random() < eventChance && !activeEvent) {
      const eventPool = possibleEvents[difficulty];
      const event = eventPool[Math.floor(Math.random() * eventPool.length)];
      setActiveEvent({ ...event, timeLeft: event.duration });
      addEvent(t("game.events.detected", { event: event.name }));
    }

    if (activeEvent) {
      if (activeEvent.timeLeft > 0) {
        setActiveEvent((evt) =>
          evt ? { ...evt, timeLeft: evt.timeLeft - 0.1 } : null
        );

        switch (activeEvent.effect) {
          case "light":
            setLight((l) =>
              Math.max(0, Math.min(100, l + activeEvent.change * 0.01))
            );
            break;
          case "temperature":
            setTemperature((t) =>
              Math.max(15, Math.min(30, t + activeEvent.change * 0.01))
            );
            break;
          case "water":
            setWater((w) =>
              Math.max(0, Math.min(100, w + activeEvent.change * 0.01))
            );
            break;
          case "co2":
            setCo2((c) =>
              Math.max(0, Math.min(100, c + activeEvent.change * 0.01))
            );
            break;
          case "energy":
            setEnergy((en) =>
              Math.max(0, Math.min(100, en + activeEvent.change * 0.01))
            );
            break;
          case "humidity":
            setHumidity((h) =>
              Math.max(0, Math.min(100, h + activeEvent.change * 0.01))
            );
            break;
          default:
            break;
        }
      } else {
        addEvent(t("game.events.resolved", { event: activeEvent.name }));
        setActiveEvent(null);
      }
    }
  };

  const addEvent = (message: string) => {
    setEvents((prev) =>
      [{ message, time: parseFloat(time.toFixed(1)) }, ...prev].slice(0, 5)
    );
  };

  const handleIncreaseResource = (resource: string, amount: number) => {
    if (difficulty === "hard" && resource !== "energy") {
      if (energy < 2) {
        addEvent(t("game.events.insufficientEnergy"));
        return;
      }
      setEnergy((e) => Math.max(0, e - 2));
    }

    setResourceAnimation(resource);
    setTimeout(() => setResourceAnimation(null), 1000);

    switch (resource) {
      case "water":
        setWater((w) => Math.max(0, Math.min(100, w + amount)));
        break;
      case "light":
        setLight((l) => Math.max(0, Math.min(100, l + amount)));
        break;
      case "nutrients":
        setNutrients((n) => Math.max(0, Math.min(100, n + amount)));
        break;
      case "temperature":
        setTemperature((t) => Math.max(15, Math.min(30, t + amount)));
        break;
      case "humidity":
        setHumidity((h) => Math.max(0, Math.min(100, h + amount)));
        break;
      case "co2":
        setCo2((c) => Math.max(0, Math.min(100, c + amount)));
        break;
      case "energy":
        setEnergy((e) => Math.max(0, Math.min(100, e + amount)));
        break;
      default:
        break;
    }
  };

  const handleDecreaseResource = (resource: string, amount: number) => {
    if (difficulty === "hard" && resource !== "energy") {
      if (energy < 2) {
        addEvent(t("game.events.insufficientEnergy"));
        return;
      }
      setEnergy((e) => Math.max(0, e - 2));
    }

    setResourceAnimation(resource);
    setTimeout(() => setResourceAnimation(null), 1000);

    switch (resource) {
      case "water":
        setWater((w) => Math.max(0, Math.min(100, w - amount)));
        break;
      case "light":
        setLight((l) => Math.max(0, Math.min(100, l - amount)));
        break;
      case "nutrients":
        setNutrients((n) => Math.max(0, Math.min(100, n - amount)));
        break;
      case "temperature":
        setTemperature((t) => Math.max(15, Math.min(30, t - amount)));
        break;
      case "humidity":
        setHumidity((h) => Math.max(0, Math.min(100, h - amount)));
        break;
      case "co2":
        setCo2((c) => Math.max(0, Math.min(100, c - amount)));
        break;
      case "energy":
        setEnergy((e) => Math.max(0, Math.min(100, e - amount)));
        break;
      default:
        break;
    }
  };

  const renderPlant = () => {
    const healthColor =
      plantHealth > 70
        ? "opacity-100"
        : plantHealth > 40
        ? "opacity-75"
        : "opacity-50";

    if (growthStage === "seed") {
      return (
        <div className="flex flex-col items-center justify-end h-full">
          <div
            className={`w-4 h-4 bg-amber-800 rounded-full ${healthColor}`}
          ></div>
          <div className="w-20 h-2 bg-gradient-to-r from-amber-900 to-amber-700 rounded-t-lg mt-1"></div>
        </div>
      );
    }

    if (growthStage === "germination") {
      return (
        <div className="flex flex-col items-center justify-end h-full">
          <div
            className={`w-2 h-12 bg-gradient-to-t from-green-700 to-green-500 rounded-t ${healthColor}`}
          ></div>
          <div className="w-20 h-2 bg-gradient-to-r from-amber-900 to-amber-700 rounded-t-lg"></div>
        </div>
      );
    }

    if (growthStage === "seedling") {
      return (
        <div className="flex flex-col items-center justify-end h-full">
          <div className="flex gap-1 mb-1">
            <div
              className={`w-6 h-4 bg-green-600 rounded-full transform -rotate-45 ${healthColor}`}
            ></div>
            <div
              className={`w-6 h-4 bg-green-600 rounded-full transform rotate-45 ${healthColor}`}
            ></div>
          </div>
          <div
            className={`w-2 h-20 bg-gradient-to-t from-green-800 to-green-600 ${healthColor}`}
          ></div>
          <div className="w-20 h-2 bg-gradient-to-r from-amber-900 to-amber-700 rounded-t-lg"></div>
        </div>
      );
    }

    if (growthStage === "vegetative") {
      return (
        <div className="flex flex-col items-center justify-end h-full">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <div
                className={`w-8 h-5 bg-green-600 rounded-full transform -rotate-45 ${healthColor}`}
              ></div>
              <div
                className={`w-8 h-5 bg-green-600 rounded-full transform rotate-45 ${healthColor}`}
              ></div>
            </div>
            <div className="flex gap-3">
              <div
                className={`w-7 h-4 bg-green-700 rounded-full transform -rotate-30 ${healthColor}`}
              ></div>
              <div
                className={`w-7 h-4 bg-green-700 rounded-full transform rotate-30 ${healthColor}`}
              ></div>
            </div>
            <div className="flex gap-2">
              <div
                className={`w-6 h-3 bg-green-700 rounded-full transform -rotate-20 ${healthColor}`}
              ></div>
              <div
                className={`w-6 h-3 bg-green-700 rounded-full transform rotate-20 ${healthColor}`}
              ></div>
            </div>
          </div>
          <div
            className={`w-3 h-32 bg-gradient-to-t from-green-900 to-green-700 ${healthColor}`}
          ></div>
          <div className="w-20 h-2 bg-gradient-to-r from-amber-900 to-amber-700 rounded-t-lg"></div>
        </div>
      );
    }

    if (growthStage === "budding") {
      return (
        <div className="flex flex-col items-center justify-end h-full">
          <div className="flex gap-1 mb-1">
            <div
              className={`w-3 h-3 bg-yellow-600 rounded-full ${healthColor}`}
            ></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <div
                className={`w-8 h-5 bg-green-600 rounded-full transform -rotate-45 ${healthColor}`}
              ></div>
              <div
                className={`w-8 h-5 bg-green-600 rounded-full transform rotate-45 ${healthColor}`}
              ></div>
            </div>
            <div className="flex gap-3">
              <div
                className={`w-7 h-4 bg-green-700 rounded-full transform -rotate-30 ${healthColor}`}
              ></div>
              <div
                className={`w-7 h-4 bg-green-700 rounded-full transform rotate-30 ${healthColor}`}
              ></div>
            </div>
          </div>
          <div
            className={`w-3 h-36 bg-gradient-to-t from-green-900 to-green-700 ${healthColor}`}
          ></div>
          <div className="w-20 h-2 bg-gradient-to-r from-amber-900 to-amber-700 rounded-t-lg"></div>
        </div>
      );
    }

    if (growthStage === "flowering") {
      return (
        <div className="flex flex-col items-center justify-end h-full">
          <div className="relative mb-2">
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="absolute top-1/2 -left-2 w-3 h-3 bg-orange-400 rounded-full transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 -right-2 w-3 h-3 bg-orange-400 rounded-full transform -translate-y-1/2"></div>
            <div className="absolute -top-2 left-1/2 w-3 h-3 bg-orange-400 rounded-full transform -translate-x-1/2"></div>
            <div className="absolute -bottom-2 left-1/2 w-3 h-3 bg-orange-400 rounded-full transform -translate-x-1/2"></div>
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg animate-pulse"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <div
                className={`w-8 h-5 bg-green-600 rounded-full transform -rotate-45 ${healthColor}`}
              ></div>
              <div
                className={`w-8 h-5 bg-green-600 rounded-full transform rotate-45 ${healthColor}`}
              ></div>
            </div>
            <div className="flex gap-3">
              <div
                className={`w-7 h-4 bg-green-700 rounded-full transform -rotate-30 ${healthColor}`}
              ></div>
              <div
                className={`w-7 h-4 bg-green-700 rounded-full transform rotate-30 ${healthColor}`}
              ></div>
            </div>
          </div>
          <div
            className={`w-3 h-40 bg-gradient-to-t from-green-900 to-green-700 ${healthColor}`}
          ></div>
          <div className="w-20 h-2 bg-gradient-to-r from-amber-900 to-amber-700 rounded-t-lg"></div>
        </div>
      );
    }

    return null;
  };

  if (gameState === "menu") {
    return (
      <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
        <div className="max-w-sm sm:max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-2xl p-6 sm:p-8 text-center">
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl">🌸</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
              {t("game.title")}
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              {t("menu.zinniaDesc")}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <button
              onClick={() => startGame("easy")}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-base sm:text-lg">🌱</span>
                <span className="text-sm sm:text-base">
                  {t("game.menuEasy")}
                </span>
              </div>
              <div className="text-xs mt-1 opacity-90">
                {t("game.menuEasyDesc")}
              </div>
            </button>

            <button
              onClick={() => startGame("hard")}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/25"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-base sm:text-lg">🚀</span>
                <span className="text-sm sm:text-base">
                  {t("game.menuHard")}
                </span>
              </div>
              <div className="text-xs mt-1 opacity-90">
                {t("game.menuHardDesc")}
              </div>
            </button>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-semibold text-blue-300 mb-1 sm:mb-2">
              🎯 {t("game.menuObjective")}
            </h3>
            <p className="text-xs text-gray-300">
              {t("game.menuObjectiveDesc")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "tutorial") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
              <span className="text-2xl">🌸</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {t("game.tutorial.missionTitle")}
            </h2>
            <p className="text-gray-400">
              {t("game.tutorial.missionSubtitle")}
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 mb-6 text-gray-300 text-sm space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-blue-300 mb-2">
                {t("game.tutorial.contextTitle")}
              </h3>
              <p className="leading-relaxed">
                {t("game.tutorial.contextDesc")}
              </p>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-green-300 mb-2">
                {t("game.tutorial.yourMissionTitle")}
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>{t("game.tutorial.missionPoint1")}</li>
                <li>{t("game.tutorial.missionPoint2")}</li>
                <li>{t("game.tutorial.missionPoint3")}</li>
                <li>{t("game.tutorial.missionPoint4")}</li>
              </ul>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {t("game.tutorial.tipsTitle")}
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                <li>{t("game.tutorial.tip1")}</li>
                <li>{t("game.tutorial.tip2")}</li>
                <li>{t("game.tutorial.tip3")}</li>
                {difficulty === "hard" && (
                  <li>{t("game.tutorial.tipHardMode1")}</li>
                )}
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setGameState("menu")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              {t("game.tutorial.back")}
            </button>
            <button
              onClick={startPlaying}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25"
            >
              {t("game.tutorial.startMission")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "won") {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-gray-900 via-green-900 to-black flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-2xl p-8 my-4">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 animate-bounce">🌸🎉</div>
            <h2 className="text-3xl font-bold text-green-400 mb-2">
              {t("game.won.missionSuccess")}
            </h2>
            <p className="text-gray-300">{t("game.won.successDesc")}</p>
          </div>

          <div className="bg-gray-900 rounded p-4 mb-4">
            <h3 className="font-semibold text-white mb-2">
              {t("game.won.statsTitle")}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-800 p-2 rounded">
                <div className="text-gray-400">{t("game.won.totalTime")}</div>
                <div className="text-white font-bold">
                  {(time / 60).toFixed(1)} min
                </div>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <div className="text-gray-400">{t("game.won.finalHealth")}</div>
                <div className="text-green-400 font-bold">
                  {plantHealth.toFixed(0)}%
                </div>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <div className="text-gray-400">
                  {t("game.won.orbitsCompleted")}
                </div>
                <div className="text-white font-bold">{orbit}</div>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <div className="text-gray-400">{t("game.won.difficulty")}</div>
                <div className="text-white font-bold">
                  {difficulty === "easy" ? "Fácil" : "Difícil"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-900 bg-opacity-50 rounded p-4 mb-4">
            <h3 className="font-semibold text-blue-300 mb-2">
              {t("game.won.realExperimentTitle")}
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              {t("game.won.realExperimentDesc")}
            </p>

            <h4 className="font-semibold text-blue-300 mb-2 mt-4">
              {t("game.won.learnMoreTitle")}
            </h4>
            <div className="space-y-2 text-sm">
              <a
                href="https://science.nasa.gov/mission/veggie/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-800 hover:bg-gray-700 p-2 rounded text-blue-400 hover:text-blue-300 transition"
              >
                {t("game.won.nasaVeggie")}
              </a>
              <a
                href="https://www.nasa.gov/image-article/first-flower-grown-space-stations-veggie-facility/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-800 hover:bg-gray-700 p-2 rounded text-blue-400 hover:text-blue-300 transition"
              >
                {t("game.won.nasaFirstFlower")}
              </a>
              <a
                href="https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-800 hover:bg-gray-700 p-2 rounded text-blue-400 hover:text-blue-300 transition"
              >
                {t("game.won.nasaGrowingPlants")}
              </a>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setGameState("menu")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {t("game.won.mainMenu")}
            </button>
            <button
              onClick={() => {
                resetGame();
                startPlaying();
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {t("game.won.playAgain")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "lost") {
    const failureReasons: Array<{ resource: string; advice: string }> = [];

    Object.entries(stressFactors).forEach(([resource, level]) => {
      if (level === "critical") {
        failureReasons.push({
          resource,
          advice: t("game.lost.resourceCritical", {
            resource: t(`game.resources.${resource}`),
          }),
        });
      }
    });

    if (plantHealth <= 0) {
      failureReasons.push({
        resource: "health",
        advice: t("game.lost.healthZero"),
      });
    }

    if (time >= 300 && growthStage !== "flowering") {
      failureReasons.push({
        resource: "time",
        advice: t("game.lost.timeExpired"),
      });
    }

    return (
      <div className="w-full h-screen bg-gradient-to-b from-gray-900 via-red-900 to-black flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-2xl p-8 my-4">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💔🌱</div>
            <h2 className="text-3xl font-bold text-red-400 mb-2">
              {t("game.lost.missionIncomplete")}
            </h2>
            <p className="text-gray-300">{t("game.lost.failureDesc")}</p>
          </div>

          <div className="bg-gray-900 rounded p-4 mb-4">
            <h3 className="font-semibold text-white mb-2">
              {t("game.lost.summaryTitle")}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div className="bg-gray-800 p-2 rounded">
                <div className="text-gray-400">
                  {t("game.lost.timeSurvived")}
                </div>
                <div className="text-white font-bold">
                  {(time / 60).toFixed(1)} min
                </div>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <div className="text-gray-400">
                  {t("game.lost.finalHealth")}
                </div>
                <div className="text-red-400 font-bold">
                  {plantHealth.toFixed(0)}%
                </div>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <div className="text-gray-400">
                  {t("game.lost.stageReached")}
                </div>
                <div className="text-white font-bold capitalize">
                  {t(`game.growthStages.${growthStage}`)}
                </div>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <div className="text-gray-400">{t("game.lost.progress")}</div>
                <div className="text-white font-bold">
                  {growthProgress.toFixed(0)}%
                </div>
              </div>
            </div>

            <h4 className="font-semibold text-red-400 mb-2">
              {t("game.lost.problemsDetected")}
            </h4>
            <div className="space-y-2">
              {failureReasons.length > 0 ? (
                failureReasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="bg-red-900 bg-opacity-30 p-2 rounded text-sm text-gray-300"
                  >
                    {reason.advice}
                  </div>
                ))
              ) : (
                <div className="bg-red-900 bg-opacity-30 p-2 rounded text-sm text-gray-300">
                  {t("game.lost.defaultFailure")}
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-900 bg-opacity-50 rounded p-4 mb-4">
            <h3 className="font-semibold text-blue-300 mb-2">
              {t("game.lost.adviceTitle")}
            </h3>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>{t("game.lost.advice1")}</li>
              <li>{t("game.lost.advice2")}</li>
              <li>{t("game.lost.advice3")}</li>
              {difficulty === "hard" && (
                <>
                  <li>{t("game.lost.adviceHardMode1")}</li>
                  <li>{t("game.lost.adviceHardMode2")}</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setGameState("menu")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {t("game.lost.mainMenu")}
            </button>
            <button
              onClick={() => {
                resetGame();
                startPlaying();
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {t("game.lost.tryAgain")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Header - Mobile Optimized */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 p-3 sm:p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-sm sm:text-lg">🌸</span>
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-white">
                {t("game.title")}
              </h1>
              <div className="text-xs sm:text-sm text-gray-300">
                {difficulty === "easy" ? t("game.easy") : t("game.hard")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <div className="text-xs sm:text-sm">
              <span className="text-gray-400">{t("game.time")}: </span>
              <span className="text-white font-bold">
                {Math.floor(time / 60)}:
                {(time % 60).toFixed(0).padStart(2, "0")}
              </span>
            </div>

            <div className="text-xs sm:text-sm hidden sm:block">
              <span className="text-gray-400">{t("game.orbit")}: </span>
              <span className="text-white font-bold">{orbit}</span>
              <span
                className={`ml-1 ${
                  isDaylight ? "text-yellow-400" : "text-blue-400"
                }`}
              >
                {isDaylight ? "☀️" : "🌙"}
              </span>
            </div>

            <button
              onClick={() =>
                setGameState(gameState === "playing" ? "paused" : "playing")
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              {gameState === "playing" ? (
                <Pause size={14} className="sm:w-4 sm:h-4" />
              ) : (
                <Play size={14} className="sm:w-4 sm:h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Area - Mobile First */}
      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
        {/* Plant Display Area */}
        <div className="flex-1 bg-gradient-to-b from-gray-800/30 to-gray-900/30 p-3 sm:p-4 lg:p-6 flex flex-col">
          <div className="flex-1 flex gap-3 sm:gap-4 lg:gap-6 items-center justify-center">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg flex flex-col gap-3 sm:gap-4">
              <div className="bg-gradient-to-b from-blue-900/50 via-gray-800/50 to-gray-900/50 rounded-xl border-2 border-gray-600/50 p-3 sm:p-4 relative overflow-hidden h-64 sm:h-72 lg:h-80 backdrop-blur-sm">
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gray-900/80 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs">
                  <div className="text-gray-400">
                    {t("game.stage")}:{" "}
                    <span className="text-white font-semibold capitalize">
                      {t(`game.growthStages.${growthStage}`)}
                    </span>
                  </div>
                </div>

                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gray-900/80 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs">
                  <div className="text-gray-400">
                    {t("game.health")}:{" "}
                    <span
                      className={`font-bold ${
                        plantHealth > 70
                          ? "text-green-400"
                          : plantHealth > 40
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {plantHealth.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                    <div className="w-full bg-gray-600 rounded-full h-1.5 sm:h-2">
                      <div
                        className="h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all"
                        style={{ width: `${growthProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 text-center">
                      {t("game.progress")}: {growthProgress.toFixed(0)}%
                    </div>
                  </div>
                </div>

                {activeEvent && (
                  <div className="absolute top-10 sm:top-14 right-2 sm:right-3 bg-red-900/80 backdrop-blur-sm text-white text-xs p-1.5 sm:p-2 rounded-lg animate-pulse">
                    <AlertTriangle
                      size={10}
                      className="inline mr-1 sm:w-3 sm:h-3"
                    />
                    <span className="hidden sm:inline">{activeEvent.name}</span>
                    <span className="sm:hidden">⚠️</span>
                  </div>
                )}

                {/* Resource Animations */}
                {resourceAnimation === "water" && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${10 + Math.random() * 20}%`,
                          animationDelay: `${i * 100}ms`,
                          animationDuration: "1s",
                        }}
                      ></div>
                    ))}
                  </div>
                )}

                {resourceAnimation === "light" && (
                  <div className="absolute inset-0 pointer-events-none bg-yellow-400 opacity-30 animate-pulse"></div>
                )}

                {resourceAnimation === "nutrients" && (
                  <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-lime-400 rounded-full"
                        style={{
                          left: `${i * 12}%`,
                          bottom: "0",
                          animation: "float-up 1s ease-out",
                          animationDelay: `${i * 80}ms`,
                        }}
                      ></div>
                    ))}
                  </div>
                )}

                {resourceAnimation === "temperature" && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/40 to-transparent animate-pulse"></div>
                  </div>
                )}

                {resourceAnimation === "humidity" && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1.5 h-3 bg-blue-300 rounded-full opacity-60"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 50}%`,
                          animation: "rain-fall 1s linear",
                          animationDelay: `${i * 80}ms`,
                        }}
                      ></div>
                    ))}
                  </div>
                )}

                {resourceAnimation === "co2" && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-8 h-8 border-2 border-gray-400 rounded-full opacity-50"
                        style={{
                          left: `${30 + i * 10}%`,
                          top: `${40 + Math.random() * 20}%`,
                          animation: "expand-fade 1s ease-out",
                          animationDelay: `${i * 150}ms`,
                        }}
                      ></div>
                    ))}
                  </div>
                )}

                {resourceAnimation === "energy" && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-yellow-400 opacity-40 animate-ping"></div>
                  </div>
                )}

                <div className="h-full flex items-end justify-center pb-20">
                  {renderPlant()}
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 overflow-hidden h-8 sm:h-10 relative">
                <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-gray-800/50 to-transparent z-10 flex items-center pl-2 sm:pl-3">
                  <span className="text-xs text-gray-400">📋</span>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-gray-800/50 to-transparent z-10"></div>
                <div className="ticker-wrapper h-full flex items-center">
                  <div className="ticker-content flex items-center gap-4 sm:gap-8 px-3 sm:px-4">
                    {events.slice(0, 3).map((event, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-gray-300 whitespace-nowrap flex items-center gap-1 sm:gap-2"
                      >
                        <span className="text-gray-500 text-xs">
                          [{event.time}s]
                        </span>
                        <span className="text-xs sm:text-xs">
                          {event.message}
                        </span>
                      </div>
                    ))}
                    {events.length > 0 &&
                      events.slice(0, 3).map((event, idx) => (
                        <div
                          key={`dup-${idx}`}
                          className="text-xs text-gray-300 whitespace-nowrap flex items-center gap-1 sm:gap-2"
                        >
                          <span className="text-gray-500 text-xs">
                            [{event.time}s]
                          </span>
                          <span className="text-xs sm:text-xs">
                            {event.message}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel - Mobile First */}
        <div className="w-full xl:w-auto xl:min-w-[400px] lg:min-w-[500px] bg-gray-900/50 backdrop-blur-sm p-3 sm:p-4 lg:p-6 overflow-y-auto border-t xl:border-t-0 xl:border-l border-gray-700/50">
          <h3 className="text-white font-bold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
            <Zap size={16} className="text-yellow-400 sm:w-4 sm:h-4" />
            {t("game.controlPanel")}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 w-full">
            <ResourceControl
              resourceId="water"
              name={t("game.resources.water")}
              value={water}
              icon={Droplet}
              info={resourceInfo.water}
              onIncrease={handleIncreaseResource}
              onDecrease={handleDecreaseResource}
              gameState={gameState}
              showInfo={showInfo}
              setShowInfo={setShowInfo}
              disabled={difficulty === "hard" && energy < 2}
            />

            <ResourceControl
              resourceId="light"
              name={t("game.resources.light")}
              value={light}
              icon={Sun}
              info={resourceInfo.light}
              onIncrease={handleIncreaseResource}
              onDecrease={handleDecreaseResource}
              gameState={gameState}
              showInfo={showInfo}
              setShowInfo={setShowInfo}
              disabled={difficulty === "hard" && energy < 2}
            />

            <ResourceControl
              resourceId="nutrients"
              name={t("game.resources.nutrients")}
              value={nutrients}
              icon={Leaf}
              info={resourceInfo.nutrients}
              onIncrease={handleIncreaseResource}
              onDecrease={handleDecreaseResource}
              gameState={gameState}
              showInfo={showInfo}
              setShowInfo={setShowInfo}
              disabled={difficulty === "hard" && energy < 2}
            />

            <ResourceControl
              resourceId="temperature"
              name={t("game.resources.temperature")}
              value={temperature}
              icon={Thermometer}
              unit="°C"
              min={15}
              max={30}
              step={0.5}
              info={resourceInfo.temperature}
              onIncrease={handleIncreaseResource}
              onDecrease={handleDecreaseResource}
              gameState={gameState}
              showInfo={showInfo}
              setShowInfo={setShowInfo}
              disabled={difficulty === "hard" && energy < 2}
            />

            {difficulty === "hard" && (
              <>
                <ResourceControl
                  resourceId="humidity"
                  name={t("game.resources.humidity")}
                  value={humidity}
                  icon={Cloud}
                  info={resourceInfo.humidity}
                  onIncrease={handleIncreaseResource}
                  onDecrease={handleDecreaseResource}
                  gameState={gameState}
                  showInfo={showInfo}
                  setShowInfo={setShowInfo}
                  disabled={energy < 2}
                />

                <ResourceControl
                  resourceId="co2"
                  name={t("game.resources.co2")}
                  value={co2}
                  icon={Wind}
                  info={resourceInfo.co2}
                  onIncrease={handleIncreaseResource}
                  onDecrease={handleDecreaseResource}
                  gameState={gameState}
                  showInfo={showInfo}
                  setShowInfo={setShowInfo}
                  disabled={energy < 2}
                />

                <ResourceControl
                  resourceId="energy"
                  name={t("game.resources.energy")}
                  value={energy}
                  icon={Zap}
                  info={resourceInfo.energy}
                  onIncrease={handleIncreaseResource}
                  onDecrease={handleDecreaseResource}
                  gameState={gameState}
                  showInfo={showInfo}
                  setShowInfo={setShowInfo}
                  disabled={false}
                />
              </>
            )}
          </div>

          {Object.keys(stressFactors).length > 0 && (
            <div className="mt-3 sm:mt-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <div className="text-xs text-yellow-400 font-semibold mb-1 sm:mb-2">
                {t("game.stressFactors")}
              </div>
              {Object.entries(stressFactors).map(([resource, level]) => (
                <div
                  key={resource}
                  className="text-xs text-yellow-300 capitalize"
                >
                  {t(`game.resources.${resource}`)}:{" "}
                  {level === "critical"
                    ? t("game.critical")
                    : t("game.warning")}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {gameState === "paused" && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full border border-gray-700/50">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 text-center">
              {t("game.pause")}
            </h2>
            <p className="text-gray-300 text-sm mb-4 sm:mb-6 text-center">
              {t("game.pausedDesc")}
            </p>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => setGameState("playing")}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25 text-sm sm:text-base"
              >
                {t("game.continue")}
              </button>
              <button
                onClick={() => setGameState("menu")}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base"
              >
                {t("game.exitMenu")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZinniaISSGame;
