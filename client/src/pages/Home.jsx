import React from 'react';
import { useNavigate } from 'react-router-dom';

const BLOCKS = [
  {
    title: 'Flats for Rent',
    subtitle: 'Find your ideal home easily',
    icon: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
  },
  {
    title: 'Commercial Shops',
    subtitle: 'Prime locations across city',
    icon: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png',
  },
  {
    title: 'Farmhouses',
    subtitle: 'Weekend getaways nearby',
    icon: 'https://cdn-icons-png.flaticon.com/512/2275/2275607.png',
  },
  {
    title: 'Post Property Free',
    subtitle: 'Rent out your property',
    icon: null,
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <section className="landing-page">
      <div className="landing-scroll">
        <div className="landing-inner">
          <div className="landing-main">
            <h1 className="landing-hero-title text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight max-w-xl">
              Find your perfect rental home today
            </h1>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="bg-[#0f172a] text-white rounded-full px-10 py-4 font-bold text-lg hover:bg-slate-800 transition-all shadow-lg"
            >
              Browse Properties
            </button>
          </div>

          <aside className="landing-blocks-col" aria-label="Browse categories">
            {BLOCKS.map((b) => (
              <button
                key={b.title}
                type="button"
                onClick={() => navigate('/login')}
                className="landing-glass-block"
              >
                <div className="landing-glass-block-icon">
                  {b.icon ? (
                    <img src={b.icon} alt="" className="w-10 h-10 opacity-90" />
                  ) : (
                    <span className="text-3xl font-black text-white drop-shadow-md">₹</span>
                  )}
                </div>
                <span className="landing-glass-block-title">{b.title}</span>
                <span className="landing-glass-block-sub">{b.subtitle}</span>
              </button>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Home;
