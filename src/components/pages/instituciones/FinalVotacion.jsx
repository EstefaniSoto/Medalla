export default function FinalVotacion() {
  return (
    <div
      className="
        min-h-dvh w-full 
        bg-[url('/img/fondo.png')] 
        bg-cover bg-center bg-no-repeat 
        flex flex-col items-center justify-center
        text-white px-4
      "
    >
      {/* LOGO */}
      <div className="text-center mb-10 -mt-15">
        <img src="/img/logo.png" alt="Logo" className="w-36 mx-auto" />

        <h1 className="text-3xl font-semibold bg-linear-to-r from-[#C7A871] to-[#615237] bg-clip-text text-transparent">
          Medalla al Mérito de la
        </h1>
        <h1 className="bg-linear-to-r from-[#C7A871] to-[#615237] bg-clip-text text-transparent text-lg font-semibold">
          Mujer Dominicana 2026
        </h1>
      </div>

      {/* MENSAJE FINAL */}
      <div
        className="
          w-full max-w-md 
          bg-black/20 backdrop-blur-sm 
          p-8 rounded-xl 
          border border-[#CDA776]
          text-center
        "
      >
        <h2 className="mb-4 bg-linear-to-r from-[#C7A871] to-[#615237] bg-clip-text text-transparent text-xl font-semibold">
          ¡Gracias por su participación!
        </h2>

        <p className="text-sm text-gray-200 leading-relaxed">
          Su votación ha sido registrada correctamente.
          <br />
          Agradecemos su compromiso con el proceso de selección de la
          <span className="font-semibold text-white">
            {" "}Medalla al Mérito de la Mujer Dominicana 2026
          </span>.
        </p>
      </div>
    </div>
  );
}
