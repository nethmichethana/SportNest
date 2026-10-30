
const categories = [
  { name: "Football", icon: "⚽", count: "120+ Products" },
  { name: "Cricket", icon: "🏏", count: "85+ Products" },
  { name: "Fitness", icon: "🏋️", count: "100+ Products" },
  { name: "Basketball", icon: "🏀", count: "60+ Products" },
];

const products = [
  {
    name: "Pro Football",
    category: "Football",
    price: "Rs. 4,500",
    icon: "⚽",
    label: "Popular",
  },
  {
    name: "Cricket Bat",
    category: "Cricket",
    price: "Rs. 8,900",
    icon: "🏏",
    label: "Best Seller",
  },
  {
    name: "Dumbbell Set",
    category: "Fitness",
    price: "Rs. 6,500",
    icon: "🏋️",
    label: "New",
  },
  {
    name: "Basketball Pro",
    category: "Basketball",
    price: "Rs. 5,200",
    icon: "🏀",
    label: "Popular",
  },
];

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="text-2xl font-black tracking-tight">
            Sport<span className="text-blue-600">Nest.</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#home" className="font-medium hover:text-blue-600">Home</a>
            <a href="#categories" className="font-medium hover:text-blue-600">Categories</a>
            <a href="#products" className="font-medium hover:text-blue-600">Products</a>
            <a href="#about" className="font-medium hover:text-blue-600">About</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="#login" className="hidden font-semibold sm:block">Login</a>
            <a href="#products" className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">
              Shop Now
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              YOUR SPORTS. YOUR PASSION.
            </span>

            <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">
              Gear Up.
              <br />
              Play <span className="text-blue-500">Beyond.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Discover quality sports equipment for every game,
              every workout and every champion.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#products" className="rounded-lg bg-blue-600 px-7 py-3.5 font-bold hover:bg-blue-700">
                Explore Products →
              </a>
              <a href="#categories" className="rounded-lg border border-slate-500 px-7 py-3.5 font-bold hover:bg-slate-800">
                View Categories
              </a>
            </div>

            <div className="mt-12 flex gap-10">
              <div>
                <p className="text-3xl font-black">500+</p>
                <p className="mt-1 text-sm text-slate-400">Products</p>
              </div>
              <div>
                <p className="text-3xl font-black">20+</p>
                <p className="mt-1 text-sm text-slate-400">Categories</p>
              </div>
              <div>
                <p className="text-3xl font-black">100%</p>
                <p className="mt-1 text-sm text-slate-400">Passion</p>
              </div>
            </div>
          </div>

          <div className="flex min-h-80 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-950 p-10">
            <div className="text-center">
              <div className="text-9xl">🏆</div>
              <p className="mt-6 text-2xl font-black">CHASE YOUR BEST</p>
              <p className="mt-2 text-blue-100">The right gear makes a difference.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-widest text-blue-600">Explore</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Shop by Category</h2>
            <p className="mt-3 text-slate-500">Find the right equipment for your favourite sport.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {categories.map((category) => (
            <a key={category.name} href="#products"
              className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg">
              <div className="text-5xl">{category.icon}</div>
              <h3 className="mt-5 text-xl font-bold">{category.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{category.count}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <p className="font-bold uppercase tracking-widest text-blue-600">Our Collection</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Featured Products</h2>
            <p className="mt-3 text-slate-500">Quality equipment to help you perform at your best.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.name}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative flex h-52 items-center justify-center bg-slate-100">
                  <span className="text-8xl">{product.icon}</span>
                  <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                    {product.label}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-sm font-medium text-blue-600">{product.category}</p>
                  <h3 className="mt-2 text-lg font-bold">{product.name}</h3>
                  <p className="mt-3 text-xl font-black">{product.price}</p>
                  <button type="button"
                    className="mt-5 w-full rounded-lg border border-blue-600 py-2.5 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white">
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="font-bold uppercase tracking-widest text-blue-600">About SportNest</p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">Everything You Need to Play Better.</h2>
        <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-500">
          SportNest is a sports equipment platform designed to make
          discovering and managing sporting products easier.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-2xl font-black">Sport<span className="text-blue-500">Nest.</span></h2>
            <p className="mt-3 text-sm text-slate-400">Gear Up. Play Beyond.</p>
          </div>
          <p className="text-sm text-slate-400">
            © 2026 SportNest. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
