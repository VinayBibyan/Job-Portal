import { useRef, useEffect } from 'react';

function HeroSection({ search, setSearch, fetchJobs }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // Generate stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 3}px`;
      star.style.height = star.style.width;
      star.style.animationDelay = `${Math.random() * 2}s`;
      hero.appendChild(star);
    }

    // Generate comet
    const comet = document.createElement('div');
    comet.className = 'comet';
    comet.style.top = `${Math.random() * 50 + 25}%`;
    comet.style.left = `${Math.random() * 100}%`;
    comet.style.animationDuration = `${Math.random() * 5 + 5}s`;
    hero.appendChild(comet);
  }, []);

  return (
    <header
      ref={heroRef}
      className="hero-animation relative h-[32vh] flex flex-col justify-center items-center text-center px-4 shadow-md"
    >
      <h1 className="text-5xl font-extrabold text-white">Find Your Dream Job</h1>
      <p className="mt-2 text-lg text-white">Opportunities that match your skills and passion</p>
      <div className="mt-6 flex items-center bg-white p-2 rounded-lg shadow-md w-full max-w-lg">
        <input
          type="text"
          placeholder="Search jobs..."
          className="p-2 text-black flex-grow focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={fetchJobs}
          className="bg-[#ffb703] text-white px-4 py-2 rounded-md hover:bg-[#fb8500] transition"
        >
          Search
        </button>
      </div>
    </header>
  );
}

export default HeroSection;