import Login from './Login';

const Home = () => {
  return (
    <section className="landing-page">
      <div className="landing-scroll">
        <div className="landing-inner">
          <div className="landing-main">
            <h1 className="landing-hero-title text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight max-w-xl">
              Find your perfect rental home today
            </h1>
            <div className="w-full max-w-md">
              <Login embedded />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
