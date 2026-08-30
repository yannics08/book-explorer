import heroImage from "../assets/hero-bg.png";

function Hero() {
  const scrollToExplore = (e) => {
    e.preventDefault();
    const exploreSection = document.getElementById("explore");
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative min-h-screen bg-cover bg-center font-serif"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      {/* Soft Dark Academia Overlay: Very subtle dark tint to keep photo bright */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1c1917]/20 via-transparent to-[#1c1917]/30" />

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-3xl border border-[#c59b27]/40 bg-[#1c1917]/75 p-8 md:p-12 rounded-lg shadow-2xl backdrop-blur-md">
          
          {/* Subtitle Accent */}
          <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-[#c59b27] block mb-3">
            Digital Archive & Collection
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#e7e5e4] leading-tight">
            Discover Your Next Book
          </h1>

          {/* Decorative Divider */}
          <div className="my-6 flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-[#c59b27]/50" />
            <span className="text-[#c59b27] text-sm">✦</span>
            <div className="h-[1px] w-12 bg-[#c59b27]/50" />
          </div>

          {/* Subtext */}
          <p className="text-base md:text-lg italic text-[#a8a29e] max-w-xl mx-auto leading-relaxed">
            Explore timeless literature, rare editions, and scholarly works bound in digital leather.
          </p>

        </div>
      </div>
    </section>
  );
}

export default Hero;