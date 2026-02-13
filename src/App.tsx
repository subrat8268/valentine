import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import QuestionPage from "./pages/QuestionPage";
import IKnewItPage from "./pages/IKnewItPage";
import FinalPage from "./pages/FinalPage";
import MusicPlayer from "./components/MusicPlayer";
import EasterEgg from "./components/EasterEgg";
import GlobalEffects from "./components/GlobalEffects";
import pic1Url from "./assets/pic1.jpg";

function App() {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [interactionScore, setInteractionScore] = useState(0);
  const [showHeartCounter, setShowHeartCounter] = useState(false);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapCountRef = useRef(0);
  const heartCountRef = useRef(0);
  const typedRef = useRef("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const triggerEasterEgg = () => {
      document.body.classList.add("animate-pulse");
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
      revealTimerRef.current = setTimeout(() => {
        setShowEasterEgg(true);
        document.body.classList.remove("animate-pulse");
      }, 400);
    };

    const handleTap = () => {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

      tapCountRef.current += 1;
      if (tapCountRef.current === 5) {
        triggerEasterEgg();
        tapCountRef.current = 0;
      }

      heartCountRef.current += 1;
      if (heartCountRef.current >= 10) {
        setShowHeartCounter(true);
        window.setTimeout(() => setShowHeartCounter(false), 2500);
        heartCountRef.current = 0;
      }

      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
        heartCountRef.current = 0;
      }, 1000);
    };

    const handleKey = (event: KeyboardEvent) => {
      const target = "hetal";
      const next = (typedRef.current + event.key.toLowerCase()).slice(
        -target.length,
      );
      typedRef.current = next;

      if (next.includes(target)) {
        alert("You’re always on my mind 💕");
        typedRef.current = "";
      }
    };

    document.addEventListener("click", handleTap);
    window.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("click", handleTap);
      window.removeEventListener("keydown", handleKey);
      document.body.classList.remove("animate-pulse");
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen safe-area">
      <div className="ambient-bg" aria-hidden="true">
        <span className="ambient-blob ambient-blob--one" />
        <span className="ambient-blob ambient-blob--two" />
        <span className="ambient-blob ambient-blob--three" />
      </div>
      <GlobalEffects
        name="For Hetal"
        photoUrl={pic1Url}
        sparkleIntensity="noticeable"
      />
      <div className="relative z-10">
        {showHeartCounter && (
          <div className="fixed top-6 right-6 z-50 rounded-full bg-rose-500/90 text-white px-4 py-2 text-sm font-semibold shadow-lg">
            Love taps unlocked 💖
          </div>
        )}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <LoadingScreen onComplete={() => navigate("/question")} />
              }
            />
            <Route
              path="/question"
              element={
                <QuestionPage
                  onYes={() => navigate("/iknewit")}
                  onInteraction={() =>
                    setInteractionScore((prev) => Math.min(prev + 1, 999))
                  }
                />
              }
            />
            <Route
              path="/iknewit"
              element={
                <IKnewItPage
                  onHeartComplete={() => navigate("/final")}
                  onInteraction={() =>
                    setInteractionScore((prev) => Math.min(prev + 1, 999))
                  }
                />
              }
            />
            <Route
              path="/final"
              element={<FinalPage interactionScore={interactionScore} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>

        <MusicPlayer />

        <AnimatePresence>
          {showEasterEgg && (
            <EasterEgg
              key="easteregg"
              onClose={() => setShowEasterEgg(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
