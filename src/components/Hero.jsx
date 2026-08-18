import heroImage from "../assets/hero-bg.png";

function Hero() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center text-center text-white">
        <div>
          <h1 className="text-5xl font-bold">
            Discover Your Next Book
          </h1>

          <p className="mt-4 text-lg">
            Explore books, authors, and editions all in one place.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;