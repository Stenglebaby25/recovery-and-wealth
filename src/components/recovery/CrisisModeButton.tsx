import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Heart, 
  Wind, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  X,
  Pause,
  Play,
  RotateCcw
} from "lucide-react";

type HALTState = "hungry" | "angry" | "lonely" | "tired" | null;

interface BreathingExercise {
  phase: "inhale" | "hold" | "exhale" | "rest";
  duration: number;
}

const HALT_OPTIONS = [
  { id: "hungry" as HALTState, label: "Hungry", emoji: "🍽️", color: "from-amber-500 to-orange-500" },
  { id: "angry" as HALTState, label: "Angry", emoji: "😤", color: "from-red-500 to-rose-500" },
  { id: "lonely" as HALTState, label: "Lonely", emoji: "💔", color: "from-purple-500 to-violet-500" },
  { id: "tired" as HALTState, label: "Tired", emoji: "😴", color: "from-blue-500 to-indigo-500" },
];

const MINDFULNESS_EXERCISES = {
  hungry: {
    title: "Nourish Your Body First",
    steps: [
      "Pause and acknowledge your hunger",
      "Ask yourself: Is this physical hunger or emotional hunger?",
      "If physical: eat something nutritious before making any financial decisions",
      "If emotional: What feeling am I trying to feed?",
    ],
    affirmation: "My body's needs are valid. I will care for myself before making decisions.",
  },
  angry: {
    title: "Cool Down Before Counting",
    steps: [
      "Acknowledge: 'I am feeling angry right now'",
      "Take 5 deep breaths using the breathing exercise below",
      "Ask: What is the real source of my anger?",
      "Consider: Will this purchase address my anger or add to it?",
    ],
    affirmation: "My anger is information, not instruction. I choose to respond, not react.",
  },
  lonely: {
    title: "Connection Over Consumption",
    steps: [
      "Recognize: Spending often masks loneliness",
      "Reach out to someone - call, text, or visit",
      "Ask yourself: Am I trying to buy connection?",
      "Remember: Purchases can't replace people",
    ],
    affirmation: "I am worthy of real connection. Material things cannot fill my need for belonging.",
  },
  tired: {
    title: "Rest Before Deciding",
    steps: [
      "Acknowledge: Fatigue impairs judgment",
      "If possible, take a 20-minute power nap",
      "Commit to revisiting this decision after rest",
      "Ask: Would well-rested me make this choice?",
    ],
    affirmation: "Sleep is not laziness. Clear decisions require a rested mind.",
  },
};

const ACCOUNTABILITY_PROMPTS = [
  "Can I wait 24 hours before making this purchase?",
  "Have I talked to my sponsor/support person about this?",
  "Is this a need or a want?",
  "How will I feel about this purchase tomorrow?",
  "Does this align with my recovery goals?",
];

export default function CrisisModeButton() {
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedHALT, setSelectedHALT] = useState<HALTState>(null);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<BreathingExercise["phase"]>("inhale");
  const [breathingProgress, setBreathingProgress] = useState(0);
  const [checkedPrompts, setCheckedPrompts] = useState<boolean[]>(new Array(ACCOUNTABILITY_PROMPTS.length).fill(false));
  const [breathingCycles, setBreathingCycles] = useState(0);

  const BREATHING_DURATIONS = {
    inhale: 4,
    hold: 4,
    exhale: 6,
    rest: 2,
  };

  const resetExercise = useCallback(() => {
    setStep(0);
    setSelectedHALT(null);
    setBreathingActive(false);
    setBreathingPhase("inhale");
    setBreathingProgress(0);
    setCheckedPrompts(new Array(ACCOUNTABILITY_PROMPTS.length).fill(false));
    setBreathingCycles(0);
  }, []);

  const handleClose = () => {
    setIsActive(false);
    resetExercise();
  };

  // Breathing exercise timer
  useEffect(() => {
    if (!breathingActive) return;

    const duration = BREATHING_DURATIONS[breathingPhase] * 1000;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setBreathingProgress((elapsed / duration) * 100);

      if (elapsed >= duration) {
        // Move to next phase
        const phases: BreathingExercise["phase"][] = ["inhale", "hold", "exhale", "rest"];
        const currentIndex = phases.indexOf(breathingPhase);
        const nextIndex = (currentIndex + 1) % phases.length;
        
        if (nextIndex === 0) {
          setBreathingCycles(prev => prev + 1);
        }
        
        setBreathingPhase(phases[nextIndex]);
        setBreathingProgress(0);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [breathingActive, breathingPhase]);

  const getPhaseInstruction = () => {
    switch (breathingPhase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
      case "rest": return "Rest";
    }
  };

  const togglePrompt = (index: number) => {
    const newChecked = [...checkedPrompts];
    newChecked[index] = !newChecked[index];
    setCheckedPrompts(newChecked);
  };

  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="group relative w-full rounded-xl border-2 border-blue-400 dark:border-blue-600 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-8 md:p-10 text-center space-y-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02]"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
          <AlertTriangle className="w-10 h-10 text-white animate-pulse" />
        </div>
        <div className="space-y-2 relative">
          <p className="font-bold text-xl text-white">Activate Crisis Mode</p>
          <p className="text-sm text-blue-100">Guided mindfulness & accountability</p>
        </div>
      </button>
    );
  }

  return (
    <Card className="border-2 border-blue-400/50 dark:border-blue-600/50 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/50 dark:via-background dark:to-blue-950/50 shadow-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white/20">
              <Heart className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl md:text-2xl">Financial HALT Support</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-2 mt-4">
          {[0, 1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s < step ? "bg-white" : s === step ? "bg-white/70" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Step 0: Initial Check-in */}
        {step === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                What are you feeling right now?
              </h3>
              <p className="text-muted-foreground">
                HALT: Hungry, Angry, Lonely, or Tired—these states make us vulnerable to poor financial decisions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {HALT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedHALT(option.id);
                    setStep(1);
                  }}
                  className={`p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 bg-gradient-to-br ${option.color} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 group hover:scale-105 hover:shadow-lg`}
                >
                  <div className="text-4xl mb-2">{option.emoji}</div>
                  <div className="font-semibold text-lg text-foreground">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Mindfulness Exercise */}
        {step === 1 && selectedHALT && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {MINDFULNESS_EXERCISES[selectedHALT].title}
              </h3>
            </div>

            <div className="space-y-4">
              {MINDFULNESS_EXERCISES[selectedHALT].steps.map((stepText, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-foreground leading-relaxed pt-1">{stepText}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-950/40 border border-blue-200 dark:border-blue-700">
              <p className="text-center italic text-blue-800 dark:text-blue-200 font-medium">
                "{MINDFULNESS_EXERCISES[selectedHALT].affirmation}"
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(0)}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Breathing Exercise */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                Calming Breath Exercise
              </h3>
              <p className="text-muted-foreground">
                4-4-6-2 breathing: A proven technique to calm your nervous system
              </p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div 
                className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-1000 ${
                  breathingActive 
                    ? breathingPhase === "inhale" 
                      ? "scale-110 bg-blue-500" 
                      : breathingPhase === "exhale" 
                        ? "scale-90 bg-blue-400" 
                        : "scale-100 bg-blue-450"
                    : "bg-blue-500"
                }`}
                style={{
                  boxShadow: breathingActive ? `0 0 ${breathingProgress}px 20px rgba(59, 130, 246, 0.3)` : undefined
                }}
              >
                <Wind className={`w-16 h-16 text-white transition-transform duration-1000 ${
                  breathingPhase === "inhale" ? "rotate-0" : breathingPhase === "exhale" ? "rotate-180" : ""
                }`} />
              </div>

              <div className="text-center space-y-2">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {breathingActive ? getPhaseInstruction() : "Ready?"}
                </p>
                <p className="text-muted-foreground">
                  {breathingActive 
                    ? `${BREATHING_DURATIONS[breathingPhase]} seconds` 
                    : "Click play to begin"}
                </p>
                {breathingActive && (
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Cycles completed: {breathingCycles}
                  </p>
                )}
              </div>

              {breathingActive && (
                <Progress value={breathingProgress} className="w-full h-2" />
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setBreathingActive(false);
                    setBreathingPhase("inhale");
                    setBreathingProgress(0);
                    setBreathingCycles(0);
                  }}
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  onClick={() => setBreathingActive(!breathingActive)}
                  className="bg-blue-500 hover:bg-blue-600 px-8"
                >
                  {breathingActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Accountability Prompts */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                Accountability Check
              </h3>
              <p className="text-muted-foreground">
                Before making any financial decision, honestly answer these questions:
              </p>
            </div>

            <div className="space-y-3">
              {ACCOUNTABILITY_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => togglePrompt(index)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    checkedPrompts[index]
                      ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700"
                      : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 hover:border-blue-400"
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    checkedPrompts[index] 
                      ? "bg-green-500 border-green-500" 
                      : "border-blue-400"
                  }`}>
                    {checkedPrompts[index] && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`font-medium ${checkedPrompts[index] ? "text-green-800 dark:text-green-200" : "text-foreground"}`}>
                    {prompt}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-950/40 border border-blue-200 dark:border-blue-700 space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  Need to talk to someone?
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Consider calling your sponsor, a trusted friend, or a support hotline before making this decision.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleClose}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
