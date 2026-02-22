import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { BarChart2 } from "lucide-react";
import HashLoader from "react-spinners/HashLoader";

import { obtenerCategorias } from "../../../../api/categorias.api";
import { obtenerPodioPorCategoria } from "../../../../api/votosInstitucionales.api";

export default function Finalistas({ onBack }) {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const [podio, setPodio] = useState([]);
  const [loading, setLoading] = useState(false);
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

  /* Cargar categorías */
  useEffect(() => {
    obtenerCategorias().then(res => setCategorias(res.data || []));
  }, []);

  /* Cargar podio cuando selecciono categoría */
  useEffect(() => {
    if (!categoriaSeleccionada) return;

    setLoading(true);
    setShowGold(false);
    setCountdown(null);

    obtenerPodioPorCategoria(categoriaSeleccionada.categoriaId)
      .then(res => {
        setPodio(res.data || []);

        if (res.data?.length > 0) {
          playDrumroll();

          setTimeout(() => setCountdown(3), 800);
          setTimeout(() => setCountdown(2), 1600);
          setTimeout(() => setCountdown(1), 2400);
          setTimeout(() => setCountdown(null), 3000);

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
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      });
  }, [categoriaSeleccionada]);

  /* =============================================================== */
  /* 🔵 1) PANTALLA DE CATEGORÍAS                                    */
  /* =============================================================== */
  if (!categoriaSeleccionada) {
    return (
      <div className="p-10">
        <button onClick={onBack} className="mb-6 underline">
          ← Volver
        </button>

        <h2 className="text-3xl font-extrabold mb-2 text-[#003478]">
          Finalistas por Categoría
        </h2>

        <p className="text-gray-500 mb-10">
          Selecciona una categoría para revelar el podio oficial
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categorias.map(c => (
            <div
              key={c.categoriaId}
              onClick={() => setCategoriaSeleccionada(c)}
              className="group bg-white rounded-2xl shadow-md p-8 cursor-pointer 
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full 
                              bg-[#003478]/10 mb-4 group-hover:bg-[#003478]/20 transition">
                <BarChart2 className="text-[#003478]" size={28} />
              </div>

              <h3 className="text-xl font-semibold text-[#003478]">
                {c.nombre}
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Ver podio de esta categoría
              </p>

              <span className="inline-block mt-4 text-sm font-medium text-[#003478] group-hover:underline">
                Ver podio →
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }


  if (loading) {
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center
                   bg-linear-to-b from-slate-900 via-black to-black text-white"
      >
        <HashLoader color="#ba8b4e" size={90} />
      </div>
    );
  }

  /* =============================================================== */
  /* PODIO FINAL                                                     */
  /* =============================================================== */

  return (
    <div className="relative min-h-dvh overflow-hidden bg-linear-to-b from-slate-900 via-black to-black text-white p-10">

      {/* 🔦 SPOTLIGHTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="spotlight left"></div>
        <div className={`spotlight center ${showGold ? "active" : ""}`}></div>
        <div className="spotlight right"></div>
      </div>

      <button
        onClick={() => setCategoriaSeleccionada(null)}
        className="relative z-10 mb-6 underline"
      >
        ← Volver a categorías
      </button>

      <h1 className="relative z-10 text-5xl font-extrabold text-center mb-3">
        🏆 Podio Final
      </h1>

      <p className="relative z-10 text-center text-xl mb-20 text-yellow-300">
        {categoriaSeleccionada.nombre}
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

      {/* 🎖 PODIO */}
      <PodioDisplay podio={podio} showGold={showGold} />
    </div>
  );
}

function PodioDisplay({ podio, showGold }) {
  if (!podio || podio.length === 0) return null;

  const resultados = [...podio];

  // Detectar empates por posición
  const empateOro = resultados[0]?.votos === resultados[1]?.votos;
  const empatePlata =
    !empateOro && resultados[1]?.votos === resultados[2]?.votos;
  const empateBronce =
    resultados[2] && resultados[3] && resultados[2].votos === resultados[3].votos;

  // Agrupaciones
  const oroGroup = empateOro ? resultados.filter(r => r.votos === resultados[0].votos) : [];
  const plataGroup = empatePlata ? resultados.filter(r => r.votos === resultados[1].votos) : [];
  const bronceGroup = empateBronce ? resultados.filter(r => r.votos === resultados[2].votos) : [];

  /* =============================================================== */
  /* 🔥 MODO EMPATE                                                  */
  /* =============================================================== */
  if (empateOro || empatePlata || empateBronce) {
    return (
      <div className="relative z-10 text-center">

        <h2 className="text-3xl font-bold text-yellow-300 mb-10 animate-pulse">
          {empateOro
            ? "⚠ Empate en el 1er lugar"
            : empatePlata
            ? "⚠ Empate en el 2do lugar"
            : "⚠ Empate en el 3er lugar"}
        </h2>

        <div className="flex justify-center items-end gap-16 flex-wrap">

          {/* ORO si no hay empate arriba */}
          {!empateOro && resultados[0] && (
            <PodioCard
              data={resultados[0]}
              emoji="🥇"
              color="bg-yellow-400"
              altura="h-80"
              ganador
              delay={0.3}
            />
          )}

          {/* EMPATE EN ORO */}
          {empateOro &&
            oroGroup.map((p, i) => (
              <PodioCard
                key={i}
                data={p}
                emoji="🥇"
                color="bg-yellow-400"
                altura="h-72"
              />
            ))}

          {/* EMPATE EN PLATA */}
          {empatePlata &&
            plataGroup.map((p, i) => (
              <PodioCard
                key={i}
                data={p}
                emoji="🥈"
                color="bg-gray-300"
                altura="h-64"
              />
            ))}

          {/* EMPATE EN BRONCE */}
          {empateBronce &&
            bronceGroup.map((p, i) => (
              <PodioCard
                key={i}
                data={p}
                emoji="🥉"
                color="bg-orange-400"
                altura="h-56"
              />
            ))}
        </div>
      </div>
    );
  }

  /* =============================================================== */
  /* 🏆 MODO NORMAL (SIN EMPATES)                                    */
  /* =============================================================== */

  return (
    <div className="relative z-10 flex justify-center items-end gap-16">

      {/* 2do lugar */}
      {resultados[1] && (
        <PodioCard
          data={resultados[1]}
          emoji="🥈"
          color="bg-gray-300"
          altura="h-64"
          delay={1}
        />
      )}

      {/* ORO */}
      {showGold && resultados[0] && (
        <PodioCard
          data={resultados[0]}
          emoji="🥇"
          color="bg-yellow-400"
          altura="h-80"
          ganador
          delay={2.2}
        />
      )}

      {/* 3er lugar */}
      {resultados[2] && (
        <PodioCard
          data={resultados[2]}
          emoji="🥉"
          color="bg-orange-400"
          altura="h-56"
          delay={0.3}
        />
      )}
    </div>
  );
}

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
            src={`http://190.166.237.107/Medalla_Al_Merito_Api/${data.fotoUrl}`}
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
