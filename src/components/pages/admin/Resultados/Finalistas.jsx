import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { obtenerCategorias } from "../../../../api/categorias.api";
import { obtenerPodioPorCategoria } from "../../../../api/votosInstitucionales.api";

export default function Finalistas({ onBack }) {
  const [categorias, setCategorias] = useState([]);
  const [indice, setIndice] = useState(0);
  const [podio, setPodio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const [showGold, setShowGold] = useState(false);

  const playVictory = () => {
    const audio = new Audio("/sounds/victory.mp3");
    audio.volume = 0.5;
    audio.play();
  };

  const playDrumroll = () => {
    const audio = new Audio("/sounds/drumroll.mp3");
    audio.volume = 0.6;
    audio.play();
  };

  /* 📂 Categorías */
  useEffect(() => {
    obtenerCategorias().then(res => setCategorias(res.data || []));
  }, []);

  /* 🏆 Podio */
  useEffect(() => {
    if (categorias.length === 0) return;

    setLoading(true);
    setShowGold(false);
    setCountdown(null);

    obtenerPodioPorCategoria(categorias[indice].categoriaId)
      .then(res => {
        setPodio(res.data || []);

        if (res.data?.length > 0) {
          playDrumroll();

          // ⏳ Countdown
          setTimeout(() => setCountdown(3), 800);
          setTimeout(() => setCountdown(2), 1600);
          setTimeout(() => setCountdown(1), 2400);
          setTimeout(() => setCountdown(null), 3000);

          // 🥇 Mostrar oro
          setTimeout(() => {
            setShowGold(true);
            confetti({
              particleCount: 280,
              spread: 100,
              origin: { y: 0.6 }
            });
            playVictory();
          }, 3200);
        }
      })
      .finally(() => setLoading(false));
  }, [indice, categorias]);

  if (categorias.length === 0) {
    return <p className="text-center mt-20 text-white">Cargando categorías…</p>;
  }

  const categoria = categorias[indice];

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-slate-900 via-black to-black text-white p-10">

      {/* 🔦 SPOTLIGHTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="spotlight left"></div>
        <div className={`spotlight center ${showGold ? "active" : ""}`}></div>
        <div className="spotlight right"></div>
      </div>

      <button onClick={onBack} className="relative z-10 mb-6 underline">
        ← Volver
      </button>

      <h1 className="relative z-10 text-5xl font-extrabold text-center mb-3">
        🏆 Podio Final
      </h1>

      <p className="relative z-10 text-center text-xl mb-20 text-yellow-300">
        {categoria.nombre}
      </p>

      {/* ⏳ COUNTDOWN */}
      <AnimatePresence>
        {countdown && (
          <motion.div
            key={countdown}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center text-8xl font-extrabold text-yellow-400 z-20"
          >
            {countdown}
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div className="relative z-10 flex justify-center items-end gap-16">

          {/* 🥉 BRONCE */}
          {podio[2] && (
            <PodioCard
              data={podio[2]}
              emoji="🥉"
              color="bg-orange-400"
              altura="h-56"
              delay={0.4}
            />
          )}

          {/* 🥇 ORO */}
          {showGold && podio[0] && (
            <PodioCard
              data={podio[0]}
              emoji="🥇"
              color="bg-yellow-400"
              altura="h-80"
              delay={0}
              ganador
            />
          )}

          {/* 🥈 PLATA */}
          {podio[1] && (
            <PodioCard
              data={podio[1]}
              emoji="🥈"
              color="bg-gray-300"
              altura="h-64"
              delay={1.2}
            />
          )}
        </div>
      )}

      {/* ⏮ ⏭ */}
      <div className="relative z-10 flex justify-center gap-6 mt-20">
        <button
          disabled={indice === 0}
          onClick={() => setIndice(i => i - 1)}
          className="px-6 py-2 bg-gray-700 rounded disabled:opacity-40"
        >
          ← Anterior
        </button>

        <button
          disabled={indice === categorias.length - 1}
          onClick={() => setIndice(i => i + 1)}
          className="px-6 py-2 bg-yellow-500 text-black rounded disabled:opacity-40"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

/* 🧱 TARJETA PODIO */
function PodioCard({ data, emoji, color, altura, delay, ganador }) {
  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1, scale: ganador ? 1.12 : 1 }}
      transition={{ delay, duration: 1.2, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      <span className="text-5xl mb-3">{emoji}</span>

      <div
        className={`${color} ${altura} w-56 rounded-t-3xl
        flex flex-col items-center justify-end pb-6 shadow-2xl
        ${ganador ? "ring-4 ring-yellow-200 animate-glow" : ""}`}
      >
        <div className="w-28 h-28 rounded-full -mt-16 border-4 border-white bg-white overflow-hidden">
          <img
            src={`https://localhost:7212${data.fotoUrl}`}
            alt={data.nombre}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="mt-4 font-extrabold text-lg text-black">
          {data.nombre}
        </h3>
        <p className="text-black">
          Votos: <strong>{data.votos}</strong>
        </p>
      </div>
    </motion.div>
  );
}
