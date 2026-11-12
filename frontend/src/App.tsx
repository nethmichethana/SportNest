
import { useEffect, useState } from "react";
import type { Product } from "./types/Product";
import { getAllProducts } from "./services/productService";
import API from "./services/api";

const categories = [
  { name: "Football", icon: "⚽", count: "120+ Products" },
  { name: "Cricket", icon: "🏏", count: "85+ Products" },
  { name: "Fitness", icon: "🏋️", count: "100+ Products" },
  { name: "Basketball", icon: "🏀", count: "60+ Products" },
];


const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    Football: "⚽",
    Cricket: "🏏",
    Fitness: "🏋️",
    Basketball: "🏀",
  };

  return icons[category] || "🏆";
};

function App() {
  
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("default");
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [loginDetails, setLoginDetails] = useState({
  email: "",
  password: "",
  });
  const [registerDetails, setRegisterDetails] = useState({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  });
  const [customerDetails, setCustomerDetails] = useState({
  customerName: "",
  email: "",
  phone: "",
  address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderMessage, setOrderMessage] = useState<string>("");
  const [orderError, setOrderError] = useState<string>("");
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllProducts();

        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
  const search = searchTerm.trim().toLowerCase();

  const matchesSearch =
    product.name.toLowerCase().includes(search) ||
    product.category.toLowerCase().includes(search);

  const matchesCategory =
    selectedCategory === "All" ||
    product.category === selectedCategory;

  return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
  switch (sortOption) {
    case "price-low-high":
      return a.price - b.price;

    case "price-high-low":
      return b.price - a.price;

    case "name-a-z":
      return a.name.localeCompare(b.name);

    case "name-z-a":
      return b.name.localeCompare(a.name);

    default:
      return 0;
  }
});


   const addToCart = (product: Product) => {
   setCart((previousCart) => {
   const existingProduct = previousCart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      return previousCart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

   
    return [...previousCart, { ...product, quantity: 1 }];
  });
};


 const cartItemCount = cart.reduce(
  (total, item) => total + item.quantity,
  0
);
 
 const cartTotal = cart.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);

const updateCartQuantity = (productId: string, change: number) => {
  setCart((previousCart) =>
    previousCart
      .map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(item.quantity + change, item.stockQuantity)
              ),
            }
          : item
      )
  );
};

const removeFromCart = (productId: string) => {
  setCart((previousCart) =>
    previousCart.filter((item) => item._id !== productId)
  );
};

const clearCart = () => {
  setCart([]);
}

const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (cart.length === 0) {
    setOrderError("Your cart is empty.");
    return;
  }

  try {
    setIsSubmitting(true);
    setOrderMessage("");
    setOrderError("");

    const orderData = {
      ...customerDetails,
      items: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
    };

    await API.post("/orders", orderData);

    setOrderMessage("Order placed successfully! Thank you for shopping with SportNest.");

    setCart([]);

    setCustomerDetails({
      customerName: "",
      email: "",
      phone: "",
      address: "",
    });

    const updatedProducts = await getAllProducts();
    setProducts(updatedProducts);

  } catch (error) {
    const message = (
      error as { response?: { data?: { message?: string } } }
    ).response?.data?.message;

    setOrderError(message || "Failed to place order. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      
     <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
     <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">

     {/* Logo */}
     <a href="#home" className="shrink-0 text-2xl font-black tracking-tight">
      Sport<span className="text-blue-600">Nest.</span>
     </a>

     {/* Navigation Links */}
    <div className="hidden items-center gap-7 lg:flex">
      <a href="#home" className="font-medium hover:text-blue-600">Home</a>
      <a href="#categories" className="font-medium hover:text-blue-600">Categories</a>
      <a href="#products" className="font-medium hover:text-blue-600">Products</a>
      <a href="#about" className="font-medium hover:text-blue-600">About</a>
    </div>

    {/* Login, Shop Now and Cart */}
    <div className="flex shrink-0 items-center gap-3">
      <button
       type="button"
       onClick={() => {
       setShowLogin(true);
       setShowRegister(false);
       }}
       className="rounded-lg border border-blue-200 bg-white/70 px-5 py-2.5 font-semibold text-blue-700 shadow-sm backdrop-blur-md transition hover:border-blue-500 hover:bg-blue-50 hover:shadow-md"
       >
      Login
      </button>


      <a
        href="#products"
        className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
      >
        Shop Now
      </a>

      {/* Shopping Cart Button */}
      <button
      type="button"
      onClick={() => setShowCart(!showCart)}
      className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
      >
      <span className="text-xl">🛒</span>

      <span>Cart ({cartItemCount})</span>
      </button>
    </div>
   </nav>
  </header>


{/* Shopping Cart Panel */}
{showCart && (
  <section className="sticky top-20 z-40 mx-auto max-w-7xl px-6">
    <div className="ml-auto mt-4 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Shopping Cart 🛒</h2>

        <button
          type="button"
          onClick={() => setShowCart(false)}
          className="text-2xl font-bold text-slate-500 hover:text-red-500"
        >
          ×
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="mt-6 text-center text-slate-500">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="mt-5 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-slate-500">
                    Rs. {item.price.toLocaleString("en-LK")} × {item.quantity}
                  </p>
                </div><div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>

               <p className="mt-1 text-sm text-slate-500">
               Rs. {item.price.toLocaleString("en-LK")}
               </p>

              {/* Quantity Controls */}
              <div className="mt-3 flex items-center gap-3">
              <button
               type="button"
               onClick={() => updateCartQuantity(item._id, -1)}
               disabled={item.quantity <= 1}
               className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 font-bold hover:bg-slate-100 disabled:opacity-40"
              >
              −
             </button>

             <span className="font-semibold">{item.quantity}</span>

             <button
             type="button"
             onClick={() => updateCartQuantity(item._id, 1)}
             disabled={item.quantity >= item.stockQuantity}
             className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 font-bold hover:bg-slate-100 disabled:opacity-40"
             >
             +
            </button>
            </div>
           </div>

                <div className="flex flex-col items-end gap-3">
                <p className="font-bold">
                 Rs. {(item.price * item.quantity).toLocaleString("en-LK")}
                </p>

               {/* Remove Product Button */}
               <button
               type="button"
               onClick={() => removeFromCart(item._id)}
               className="text-sm font-semibold text-red-500 transition hover:text-red-700"
               >
               Remove
               </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <span className="font-bold">Total:</span>
            <span className="text-xl font-black text-blue-600">
              Rs. {cartTotal.toLocaleString("en-LK")}
            </span>
          </div>

          {/* Clear Cart Button */}
         <button
          type="button"
          onClick={clearCart}
          className="mt-5 w-full rounded-lg border border-red-500 py-3 font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
          >
           Clear Cart
           </button>

           {/* Checkout Button */}
           <button
           type="button"
           onClick={() => {
           setShowCart(false);
           setShowCheckout(true);
           console.log("Checkout opened:", true);
           }}
          className="mt-3 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
           >
          Proceed to Checkout
         </button>
        </>
      )}
    </div>
  </section>
)}



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
                <p className="text-3xl font-black">{products.length}+</p>
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
        <div className="mb-10">
          <p className="font-bold uppercase tracking-widest text-blue-600">Explore</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Shop by Category</h2>
          <p className="mt-3 text-slate-500">
            Find the right equipment for your favourite sport.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href="#products"
              className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"
            >
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
          
            <p className="mt-3 text-slate-500">
              Quality equipment to help you perform at your best.
            </p>
        {/* Product Search Bar */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus-within:border-blue-500">
              <span className="text-xl">🔍</span>
           <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none"
            />
           </div>
          </div>
          {/* Category Filter Buttons */}
         <div className="mt-6 flex flex-wrap gap-3">
          <button
           onClick={() => setSelectedCategory("All")}
           className={`rounded-full px-5 py-2 font-semibold transition ${
           selectedCategory === "All"
           ? "bg-blue-600 text-white"
           : "bg-white text-slate-700 hover:bg-blue-50"
          }`}
          >
         All
        </button>

        {categories.map((category) => (
        <button
         key={category.name}
         onClick={() => setSelectedCategory(category.name)}
         className={`rounded-full px-5 py-2 font-semibold transition ${
         selectedCategory === category.name
          ? "bg-blue-600 text-white"
          : "bg-white text-slate-700 hover:bg-blue-50"
        }`}
        >
       {category.icon} {category.name}
       </button>
       ))}
       </div>
      </div>

      {/* Product Sorting Dropdown */}
      <div className="mt-6 max-w-xs">
      <label
       htmlFor="sortProducts"
       className="mb-2 block font-semibold text-slate-700"
      >
       Sort Products:
      </label>

       <select
       id="sortProducts"
       value={sortOption}
       onChange={(e) => setSortOption(e.target.value)}
       className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
      >
      <option value="default">Default</option>
      <option value="price-low-high">Price: Low to High</option>
      <option value="price-high-low">Price: High to Low</option>
      <option value="name-a-z">Name: A to Z</option>
      <option value="name-z-a">Name: Z to A</option>
     </select>
     </div>  

          {/* Loading */}
          {loading && (
            <p className="py-10 text-center text-lg font-semibold text-blue-600">
              Loading products...
            </p>
          )}

          {/* Error */}
          {!loading && error && (
            <p className="py-10 text-center text-red-600">{error}</p>
          )}

          {/* Empty products */}
          {!loading && !error && products.length === 0 && (
            <p className="py-10 text-center text-slate-500">
              No products available yet.
            </p>
          )}

          {/* Display products from MongoDB */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* No Products Found Message */}
        {!loading && !error && filteredProducts.length === 0 && (
         <div className="col-span-full py-12 text-center">
           <div className="text-6xl">🔍</div>

           <h3 className="mt-4 text-2xl font-bold text-slate-800">
             No Products Found
           </h3>

       <p className="mt-2 text-slate-500">
          Sorry, we couldn't find any products matching your search.
       </p>

      <button
         onClick={() => {
         setSearchTerm("");
         setSelectedCategory("All");
        }}
        className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Clear Filters
      </button>
     </div>
    )}
              
              {sortedProducts.map((product) => (
                <article
                  key={product._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex h-52 items-center justify-center bg-slate-100">
                    {product.imageUrl ? (
                      <img
                        src={`/images/${product.imageUrl}`}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-8xl">
                        {getCategoryIcon(product.category)}
                      </span>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                      {product.isActive ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-sm font-medium text-blue-600">
                      {product.category}
                    </p>

                    <h3 className="mt-2 text-lg font-bold">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {product.description}
                    </p>

                    <p className="mt-3 text-xl font-black">
                      Rs. {product.price.toLocaleString("en-LK")}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Stock: {product.stockQuantity}
                    </p>

                    {/* Add to Cart Button */}
                    <button
                    type="button"
                    onClick={() => addToCart(product)}
                    disabled={product.stockQuantity <= 0 || !product.isActive}
                    className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                    🛒 Add to Cart
                    </button> 

                    <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="mt-5 w-full rounded-lg border border-blue-600 py-2.5 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                    >
                    View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>



{/* Checkout Modal */}
{showCheckout && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">

    <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">

      {/* Close Button */}
      <button
        type="button"
        onClick={() => setShowCheckout(false)}
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-600 transition hover:bg-red-100 hover:text-red-600"
      >
        ×
      </button>

      {/* Heading */}
      <div className="mb-6 pr-10">
        <p className="font-bold uppercase tracking-widest text-blue-600">
          SportNest Checkout
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-900">
          Complete Your Order
        </h2>

        <p className="mt-2 text-slate-500">
          Enter your delivery information to place your order.
        </p>
      </div>

      {/* Order Total */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-blue-50 p-4">
        <span className="font-semibold text-slate-700">
          Order Total
        </span>

        <span className="text-xl font-black text-blue-600">
          Rs. {cartTotal.toLocaleString("en-LK")}
        </span>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handlePlaceOrder} className="space-y-5">

        {/* Success Message */}
        {orderMessage && (
          <p className="rounded-lg bg-green-100 p-3 text-green-700">
            {orderMessage}
          </p>
        )}

        {/* Error Message */}
        {orderError && (
          <p className="rounded-lg bg-red-100 p-3 text-red-700">
            {orderError}
          </p>
        )}

        {/* Customer Name */}
        <div>
          <label className="mb-2 block font-semibold">
            Customer Name
          </label>

          <input
            type="text"
            required
            value={customerDetails.customerName}
            onChange={(e) =>
              setCustomerDetails({
                ...customerDetails,
                customerName: e.target.value,
              })
            }
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block font-semibold">
            Email Address
          </label>

          <input
            type="email"
            required
            value={customerDetails.email}
            onChange={(e) =>
              setCustomerDetails({
                ...customerDetails,
                email: e.target.value,
              })
            }
            placeholder="Enter your email"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block font-semibold">
            Phone Number
          </label>

          <input
            type="tel"
            required
            value={customerDetails.phone}
            onChange={(e) =>
              setCustomerDetails({
                ...customerDetails,
                phone: e.target.value,
              })
            }
            placeholder="Enter your phone number"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Delivery Address */}
        <div>
          <label className="mb-2 block font-semibold">
            Delivery Address
          </label>

          <textarea
            required
            rows={3}
            value={customerDetails.address}
            onChange={(e) =>
              setCustomerDetails({
                ...customerDetails,
                address: e.target.value,
              })
            }
            placeholder="Enter your delivery address"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Place Order */}
        <button
          type="submit"
          disabled={isSubmitting || cart.length === 0}
          className="w-full rounded-lg bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>

      </form>

    </div>
  </div>
)}

{/* Product Details Modal */}
{selectedProduct && (
  <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">

    <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">

      {/* Close Button */}
      <button
        type="button"
        onClick={() => setSelectedProduct(null)}
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-600 hover:bg-red-100 hover:text-red-600"
      >
        ×
      </button>

      <div className="grid gap-8 md:grid-cols-2">

        {/* Product Image */}
        <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
          {selectedProduct.imageUrl ? (
            <img
              src={`/images/${selectedProduct.imageUrl}`}
              alt={selectedProduct.name}
              className="h-full max-h-80 w-full object-cover"
            />
          ) : (
            <span className="text-8xl">
              {getCategoryIcon(selectedProduct.category)}
            </span>
          )}
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">

          <p className="font-bold uppercase tracking-widest text-blue-600">
            {selectedProduct.category}
          </p>

          <h2 className="mt-3 text-3xl font-black text-slate-900">
            {selectedProduct.name}
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            {selectedProduct.description}
          </p>

          <p className="mt-5 text-3xl font-black text-blue-600">
            Rs. {selectedProduct.price.toLocaleString("en-LK")}
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-600">
            Stock Available: {selectedProduct.stockQuantity}
          </p>

          <p className={`mt-2 text-sm font-bold ${
            selectedProduct.isActive ? "text-green-600" : "text-red-600"
          }`}>
            {selectedProduct.isActive ? "Available" : "Unavailable"}
          </p>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={() => {
              addToCart(selectedProduct);
              setSelectedProduct(null);
            }}
            disabled={
              selectedProduct.stockQuantity <= 0 ||
              !selectedProduct.isActive
            }
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            🛒 Add to Cart
          </button>

        </div>
      </div>
    </div>
  </div>
)}


      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="font-bold uppercase tracking-widest text-blue-600">About SportNest</p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">
          Everything You Need to Play Better.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-500">
          SportNest is a sports equipment platform designed to make
          discovering and managing sporting products easier.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-2xl font-black">
              Sport<span className="text-blue-500">Nest.</span>
            </h2>
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
