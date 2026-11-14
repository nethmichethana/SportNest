
import { useEffect, useState } from "react";
import type { Product } from "./types/Product";
import { getAllProducts,createProduct,updateProduct,deleteProduct, } from "./services/productService";
import API from "./services/api";
import type { Order } from "./types/Order";
import type { ProductInput } from "./services/productService";
import { getMyOrders, getAllOrders, updateOrderStatus, } from "./services/orderService";

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
  const [showMyOrders, setShowMyOrders] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");
  const [isSendingResetEmail, setIsSendingResetEmail] = useState<boolean>(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string>("");
  const [forgotPasswordError, setForgotPasswordError] = useState<string>("");
  const [resetPasswordMessage, setResetPasswordMessage] = useState<string>("");
  const [resetPasswordError, setResetPasswordError] = useState<string>("");
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [resetToken, setResetToken] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [registerMessage, setRegisterMessage] = useState<string>("");
  const [registerError, setRegisterError] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginMessage, setLoginMessage] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [ordersError, setOrdersError] = useState<string>("");

const [showProductForm, setShowProductForm] = useState<boolean>(false);

const [productForm, setProductForm] = useState<ProductInput>({
  name: "",
  description: "",
  price: 0,
  category: "Football",
  stockQuantity: 0,
  imageUrl: "",
  isActive: true,
});

const [productFormError, setProductFormError] = useState<string>("");
const [productFormSuccess, setProductFormSuccess] = useState<string>("");
const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);
const [editingProductId, setEditingProductId] = useState<string | null>(null);


  const [loggedInUser, setLoggedInUser] = useState<{
  name: string;
  email: string;
  role: string;
} | null>(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
});
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

useEffect(() => {
  const path = window.location.pathname;

  if (path.startsWith("/reset-password/")) {
    const token = path.split("/reset-password/")[1];

    if (token) {
      setResetToken(token);
    }
  }
}, []);
  

const [showAdminDashboard, setShowAdminDashboard] =
  useState<boolean>(false);

const [allOrders, setAllOrders] = useState<Order[]>([]);

const [adminOrdersLoading, setAdminOrdersLoading] =
  useState<boolean>(false);

const [adminOrdersError, setAdminOrdersError] =
  useState<string>("");


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

const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setRegisterMessage("");
  setRegisterError("");

  if (registerDetails.password !== registerDetails.confirmPassword) {
    setRegisterError("Passwords do not match.");
    return;
  }

  if (registerDetails.password.length < 6) {
    setRegisterError("Password must contain at least 6 characters.");
    return;
  }

  try {
    setIsRegistering(true);

    const response = await API.post("/auth/register", {
      name: registerDetails.name,
      email: registerDetails.email,
      password: registerDetails.password,
    });

    setRegisterMessage(response.data.message);

    setRegisterDetails({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setShowRegister(false);
    setShowLogin(true);
    setLoginDetails({
      email: registerDetails.email,
      password: "",
    });

  } catch (error) {
    const message = (
      error as { response?: { data?: { message?: string } } }
    ).response?.data?.message;

    setRegisterError(message || "Registration failed. Please try again.");
  } finally {
    setIsRegistering(false);
  }
};


const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setLoginMessage("");
  setLoginError("");

  try {
    setIsLoggingIn(true);

    const response = await API.post("/auth/login", loginDetails);

    const { token, name, email, role } = response.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify({ name, email, role })
    );

    setLoggedInUser({
    name,
    email,
    role,
    });

    setLoginMessage("Login successful! Welcome to SportNest.");

    setLoginDetails({
      email: "",
      password: "",
    });

    setShowLogin(false);

  } catch (error) {
    const message = (
      error as { response?: { data?: { message?: string } } }
    ).response?.data?.message;

    setLoginError(message || "Login failed. Please try again.");
  } finally {
    setIsLoggingIn(false);
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setLoggedInUser(null);
};

const handleForgotPassword = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setForgotPasswordMessage("");
  setForgotPasswordError("");

  if (!forgotPasswordEmail.trim()) {
    setForgotPasswordError("Please enter your email address.");
    return;
  }

  try {
    setIsSendingResetEmail(true);

    const response = await API.post("/auth/forgot-password", {
      email: forgotPasswordEmail.trim(),
    });

    setForgotPasswordMessage(response.data.message);

  } catch (error) {
    const message = (
      error as { response?: { data?: { message?: string } } }
    ).response?.data?.message;

    setForgotPasswordError(
      message || "Unable to send reset email. Please try again."
    );
  } finally {
    setIsSendingResetEmail(false);
  }
};

const handleResetPassword = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setResetPasswordMessage("");
  setResetPasswordError("");

  if (!resetToken) {
    setResetPasswordError("Invalid password reset link.");
    return;
  }

  if (newPassword.length < 6) {
    setResetPasswordError("Password must contain at least 6 characters.");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    setResetPasswordError("Passwords do not match.");
    return;
  }

  try {
    setIsResettingPassword(true);

    const response = await API.post(
      `/auth/reset-password/${resetToken}`,
      { password: newPassword }
    );

    setResetPasswordMessage(response.data.message);

    setNewPassword("");
    setConfirmNewPassword("");

  } catch (error) {
    const message = (
      error as { response?: { data?: { message?: string } } }
    ).response?.data?.message;

    setResetPasswordError(
      message || "Password reset failed. Please try again."
    );
  } finally {
    setIsResettingPassword(false);
  }
};


const handleShowMyOrders = async () => {
  if (!loggedInUser) {
    setShowLogin(true);
    return;
  }

  setShowMyOrders(true);
  setOrdersLoading(true);
  setOrdersError("");

  try {
    const orders = await getMyOrders();
    setMyOrders(orders);
  } catch (error) {
    const message = (
      error as { response?: { data?: { message?: string } } }
    ).response?.data?.message;

    setOrdersError(message || "Failed to load your orders.");
  } finally {
    setOrdersLoading(false);
  }
};


const handleShowAdminDashboard = async () => {
  if (!loggedInUser || loggedInUser.role !== "admin") {
    setShowLogin(true);
    return;
  }

  setShowAdminDashboard(true);
  setAdminOrdersLoading(true);
  setAdminOrdersError("");

  try {
    const orders = await getAllOrders();
    setAllOrders(orders);
  } catch (error) {
    const message = (
      error as { response?: { data?: { message?: string } } }
    ).response?.data?.message;

    setAdminOrdersError(
      message || "Failed to load all orders."
    );
  } finally {
    setAdminOrdersLoading(false);
  }
};



const handleCreateProduct = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setProductFormError("");
  setProductFormSuccess("");

  if (
    !productForm.name.trim() ||
    !productForm.description.trim() ||
    !productForm.imageUrl.trim() ||
    productForm.price <= 0 ||
    productForm.stockQuantity < 0
  ) {
    setProductFormError("Please enter valid product details.");
    return;
  }

  setIsSavingProduct(true);

  try {
    if (editingProductId) {
      await updateProduct(editingProductId, productForm);
      setProductFormSuccess("Product updated successfully!");
    } else {
      await createProduct(productForm);
      setProductFormSuccess("Product added successfully!");
    }

    const updatedProducts = await getAllProducts();
    setProducts(updatedProducts);

    setProductForm({
      name: "",
      description: "",
      price: 0,
      category: "Football",
      stockQuantity: 0,
      imageUrl: "",
      isActive: true,
    });

    setEditingProductId(null);
    setShowProductForm(false);

  } catch (error) {
    const message = (
      error as {
        response?: { data?: { message?: string } };
      }
    ).response?.data?.message;

    setProductFormError(message || "Failed to save product.");
  } finally {
    setIsSavingProduct(false);
  }
};



  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      
     <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
     
<nav className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 lg:px-6">

  {/* Logo */}
  <a href="#home" className="shrink-0 text-2xl font-black tracking-tight">
    Sport<span className="text-blue-600">Nest.</span>
  </a>

  {/* Navigation Links */}
  <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/60 p-1.5 shadow-lg shadow-blue-100/40 backdrop-blur-xl xl:flex">
    {[
      { name: "Home", href: "#home" },
      { name: "Categories", href: "#categories" },
      { name: "Products", href: "#products" },
      { name: "About", href: "#about" },
    ].map((link) => (
      <a
        key={link.name}
        href={link.href}
        className="whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-blue-600 hover:text-white"
      >
        {link.name}
      </a>
    ))}
  </div>

  {/* My Orders */}
  {loggedInUser && (
    <button
      type="button"
      onClick={handleShowMyOrders}
      className="shrink-0 rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
    >
      My Orders
    </button>
  )}

  {/* User Actions */}
  <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2">

    {loggedInUser ? (
      <>
        {/* Admin Dashboard */}
        {loggedInUser.role === "admin" && (
          <button
            type="button"
            onClick={handleShowAdminDashboard}
            className="shrink-0 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
          >
            Admin Dashboard
          </button>
        )}

        {/* Username */}
        <span className="hidden whitespace-nowrap text-sm font-semibold text-blue-800 sm:block">
          Hi, {loggedInUser.name}
        </span>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 rounded-lg bg-red-500 px-3 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-600"
        >
          Logout
        </button>
      </>
    ) : (
      <button
        type="button"
        onClick={() => {
          setShowLogin(true);
          setShowRegister(false);
        }}
        className="shrink-0 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
      >
        Login
      </button>
    )}

    {/* Shop Now */}
    <a
      href="#products"
      className="shrink-0 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      Shop Now
    </a>

    {/* Shopping Cart */}
    <button
      type="button"
      onClick={() => setShowCart(!showCart)}
      className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      <span className="text-lg">🛒</span>
      <span>Cart ({cartItemCount})</span>
    </button>

  </div>
</nav>

  </header>



{/* Admin Dashboard Modal */}
{showAdminDashboard && loggedInUser?.role === "admin" && (
  <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/70 p-4 backdrop-blur-sm">
    <div className="mx-auto my-8 max-w-6xl rounded-2xl bg-white p-6 shadow-2xl">

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-slate-500">
            Manage SportNest orders
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdminDashboard(false)}
          className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200"
        >
          ✕ Close
        </button>
      </div>

      {adminOrdersLoading ? (
        <p className="py-10 text-center text-blue-600">
          Loading orders...
        </p>
      ) : adminOrdersError ? (
        <p className="py-10 text-center text-red-600">
          {adminOrdersError}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div className="rounded-xl bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-600">
                Total Orders
              </p>
              <h3 className="mt-2 text-3xl font-black text-blue-900">
                {allOrders.length}
              </h3>
            </div>

            <div className="rounded-xl bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-600">
                Pending Orders
              </p>
              <h3 className="mt-2 text-3xl font-black text-amber-900">
                {allOrders.filter(
                  (order) => order.status === "Pending"
                ).length}
              </h3>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm font-semibold text-green-600">
                Total Revenue
              </p>
              <h3 className="mt-2 text-3xl font-black text-green-900">
                Rs. {allOrders
                  .filter((order) => order.status !== "Cancelled")
                  .reduce((total, order) => total + order.totalAmount, 0)
                  .toLocaleString()}
              </h3>
            </div>

          </div>


          <div className="mb-6 flex justify-end">
           <button
           type="button"
           onClick={() => {
           setProductFormError("");
           setProductFormSuccess("");
           setShowProductForm(true);
           setEditingProductId(null);
          }}
          className="mt-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-bold text-white shadow-lg transition hover:scale-105"
           >
          + Add New Product
         </button>
         </div>


{/* Add Product Form */}
{showProductForm && (
  <div className="mb-8 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-6 shadow-lg">

    <h3 className="mb-5 text-xl font-black text-slate-800">
       {editingProductId ? "Edit Product" : "Add New Product"}
    </h3>

    <form onSubmit={handleCreateProduct} className="space-y-4">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Product Name
          </label>
          <input
            type="text"
            required
            value={productForm.name}
            onChange={(e) =>
              setProductForm({ ...productForm, name: e.target.value })
            }
            placeholder="Enter product name"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category
          </label>
          <select
            value={productForm.category}
            onChange={(e) =>
              setProductForm({ ...productForm, category: e.target.value })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="Football">Football</option>
            <option value="Cricket">Cricket</option>
            <option value="Fitness">Fitness</option>
            <option value="Basketball">Basketball</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Price (Rs.)
          </label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={productForm.price}
            onChange={(e) =>
              setProductForm({ ...productForm, price: Number(e.target.value) })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Stock Quantity
          </label>
          <input
            type="number"
            required
            min="0"
            step="1"
            value={productForm.stockQuantity}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                stockQuantity: Number(e.target.value),
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Product Description
        </label>
        <textarea
          required
          rows={3}
          value={productForm.description}
          onChange={(e) =>
            setProductForm({ ...productForm, description: e.target.value })
          }
          placeholder="Enter product description"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Product Image URL
        </label>
        <input
          type="text"
          required
          value={productForm.imageUrl}
          onChange={(e) =>
            setProductForm({ ...productForm, imageUrl: e.target.value })
          }
          placeholder="/images/football.jpg"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
        <input
          type="checkbox"
          checked={productForm.isActive}
          onChange={(e) =>
            setProductForm({ ...productForm, isActive: e.target.checked })
          }
          className="h-4 w-4 accent-blue-600"
        />
        Product is Active
      </label>

      {productFormError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {productFormError}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-3">

        <button
          type="button"
          onClick={() => setShowProductForm(false)}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSavingProduct}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
        >
         {isSavingProduct
             ? "Saving..." : editingProductId
             ? "Update Product": "Save Product"}
        </button>

      </div>

    </form>
  </div>
)}



{/* Product Management Section */}
<div className="mb-10">

  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h3 className="text-xl font-black text-slate-800">
        Product Management
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Manage all SportNest products
      </p>
    </div>

    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
      {products.length} Products
    </span>
  </div>

  {products.length === 0 ? (
    <p className="rounded-xl bg-slate-50 p-8 text-center text-slate-500">
      No products available.
    </p>
  ) : (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

      {products.map((product) => (
        <div
          key={product._id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-40 w-full bg-slate-100 object-contain p-3"
          />

          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              {product.category}
            </p>

            <h4 className="mt-1 text-lg font-bold text-slate-800">
              {product.name}
            </h4>

            <p className="mt-2 font-black text-blue-700">
              Rs. {product.price.toLocaleString()}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Stock: {product.stockQuantity}
            </p>
            
            
          <div className="mt-4 flex gap-2">
            <button
             type="button"
             onClick={() => {
             setProductFormError("");
             setProductFormSuccess("");
             setEditingProductId(product._id);
             setProductForm({
             name: product.name,
             description: product.description,
             price: product.price,
             category: product.category,
             stockQuantity: product.stockQuantity,
             imageUrl: product.imageUrl,
             isActive: product.isActive,
            });
             setShowProductForm(true);
            }}
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700"
           >
           Edit
          </button>

          <button
          type="button"
          onClick={async () => {
          if (!window.confirm(`Delete ${product.name}?`)) return;

         try {
          await deleteProduct(product._id);
          setProducts((previousProducts) =>
           previousProducts.filter((item) => item._id !== product._id)
          );
        } catch (error) {
          alert("Failed to delete product.");
        }
       }}
        className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white hover:bg-red-600"
        >
         Delete
       </button>
       </div>


            <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${
              product.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {product.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      ))}

    </div>
  )}
</div>

 

          <h3 className="mb-4 mt-8 text-xl font-bold text-slate-800">
            All Customer Orders
          </h3>

          {allOrders.length === 0 ? (
            <p className="py-10 text-center text-slate-500">
              No orders available.
            </p>
          ) : (
            <div className="space-y-4">
              {allOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-800">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {order.email}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Order ID: {order._id}
                      </p>
                    </div>


            <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-2 text-sm font-bold text-blue-700">
            {order.status}
            </span>

            <select
             value={order.status}
             onChange={async (e) => {
             const newStatus = e.target.value as Order["status"];

            try {
            const updatedOrder = await updateOrderStatus(
             order._id,
             newStatus
            );

            setAllOrders((previousOrders) =>
            previousOrders.map((item) =>
            item._id === order._id ? updatedOrder : item
           )
          );
         } catch (error) {
           alert(
            (error as {
              response?: { data?: { message?: string } };
            }).response?.data?.message ||
            "Failed to update order status."
           );
         }
        }}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
       >
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
       </select>
       </div>

                  </div>

                  <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-4">
                    <span className="text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>

                    <span className="font-bold text-blue-700">
                      Rs. {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  </div>
)}



{/* My Orders Modal */}
{showMyOrders && (
  <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
    <div className="mx-auto my-10 max-w-4xl rounded-2xl bg-white p-6 shadow-2xl">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            My Orders
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View your order history
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowMyOrders(false)}
          className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200"
        >
          ✕ Close
        </button>
      </div>

      {ordersLoading ? (
        <p className="py-10 text-center text-blue-600">
          Loading your orders...
        </p>
      ) : ordersError ? (
        <p className="py-10 text-center text-red-600">
          {ordersError}
        </p>
      ) : myOrders.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-5xl">📦</p>
          <h3 className="mt-4 text-xl font-bold text-slate-800">
            No Orders Yet
          </h3>
          <p className="mt-2 text-slate-500">
            Your orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {myOrders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border border-slate-200 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">Order ID</p>
                  <p className="font-semibold text-slate-800">
                    {order._id}
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                  {order.status}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-500">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <h4 className="mb-2 font-bold text-slate-800">
                  Ordered Products
                </h4>

                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex justify-between gap-3 py-2 text-sm"
                  >
                    <span className="text-slate-600">
                      {item.name} × {item.quantity}
                    </span>

                    <span className="font-semibold text-slate-800">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
                <span className="font-bold text-slate-700">
                  Total Amount
                </span>

                <span className="text-lg font-black text-blue-700">
                  Rs. {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  </div>
)}



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
        if (!loggedInUser) {
          setShowCart(false);
          setShowLogin(true);
          setLoginMessage("");
          setLoginError("");
          return;
       }

       setShowCart(false);
       setShowCheckout(true);
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
     <div className="mt-10 mb-8 max-w-xs">

    <label
    htmlFor="sortProducts"
    className="mb-3 block text-sm font-bold tracking-wide text-slate-700"
    >
    Sort Products
    </label>

    <div className="relative">
    <select
      id="sortProducts"
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
      className="w-full appearance-none rounded-xl border border-blue-100 bg-white/80 px-5 py-3.5 pr-12 text-sm font-semibold text-slate-700 shadow-md shadow-blue-100/40 backdrop-blur-lg outline-none transition-all duration-300 hover:border-blue-300 hover:shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    >
      <option value="default">Default</option>
      <option value="price-low-high">Price: Low to High</option>
      <option value="price-high-low">Price: High to Low</option>
      <option value="name-a-z">Name: A to Z</option>
      <option value="name-z-a">Name: Z to A</option>
    </select>

    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-blue-600">
      ▼
    </span>
  </div>

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



{/* Login Modal */}
{showLogin && (
  <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-md">

    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/40 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">

      {/* Decorative Background */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="relative">

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setShowLogin(false)}
          className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-600 transition hover:bg-red-100 hover:text-red-600"
        >
          ×
        </button>

        {/* Logo */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Sport<span className="text-blue-600">Nest.</span>
          </h2>

          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-blue-600" />

          <h3 className="mt-6 text-2xl font-black text-slate-900">
            Welcome Back!
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue your sports journey.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              required
              value={loginDetails.email}
              onChange={(e) =>
                setLoginDetails({
                  ...loginDetails,
                  email: e.target.value,
                })
              }
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Password
            </label>

            <input
              type="password"
              required
              value={loginDetails.password}
              onChange={(e) =>
                setLoginDetails({
                  ...loginDetails,
                  password: e.target.value,
                })
              }
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>


          {/* Forgot Password Link */}
          <div className="mt-2 flex justify-end">
           <button
            type="button"
            onClick={() => {
            setShowLogin(false);
            setShowForgotPassword(true);
            setForgotPasswordMessage("");
            setForgotPasswordError("");
            }}
            className="text-sm font-semibold text-blue-600 transition hover:text-indigo-700 hover:underline"
             >
            Forgot Password?
           </button>
          </div>

          {loginMessage && (
          <p className="text-green-600 text-sm">{loginMessage}</p>
           )}

          {loginError && (
          <p className="text-red-600 text-sm">{loginError}</p>
          )}

          {/* Login Button */}
           <button
           type="submit"
           disabled={isLoggingIn}
           className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
           >
           {isLoggingIn ? "Logging In..." : "Login to SportNest"}
           </button>

        </form>

        {/* Register Link */}
        <p className="mt-7 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
            className="font-bold text-blue-600 hover:text-blue-800"
          >
            Create an Account
          </button>
        </p>

      </div>
    </div>
  </div>
)}




{/* Forgot Password Modal */}
{showForgotPassword && (
  <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-md">

    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/50 bg-white/85 p-8 shadow-2xl shadow-blue-950/20 backdrop-blur-2xl">

      {/* Close Button */}
      <button
        type="button"
        onClick={() => setShowForgotPassword(false)}
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-red-50 hover:text-red-500"
      >
        ✕
      </button>

      {/* Icon */}
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl text-white shadow-lg shadow-blue-200">
        🔐
      </div>

      {/* Heading */}
      <div className="mb-7 text-center">
        <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-800">
          Forgot Password?
        </h2>

        <p className="text-sm leading-6 text-slate-500">
          Don't worry! Enter your registered email address
          and we'll send you a password reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleForgotPassword} className="space-y-5">

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Email Address
          </label>

          <input
            type="email"
            required
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            placeholder="Enter your registered email"
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Success Message */}
        {forgotPasswordMessage && (
          <p className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {forgotPasswordMessage}
          </p>
        )}

        {/* Error Message */}
        {forgotPasswordError && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {forgotPasswordError}
          </p>
        )}

        {/* Send Reset Link Button */}
        <button
          type="submit"
          disabled={isSendingResetEmail}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSendingResetEmail
            ? "Sending Reset Link..."
            : "Send Reset Link"}
        </button>

      </form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            setShowForgotPassword(false);
            setShowLogin(true);
          }}
          className="text-sm font-bold text-blue-600 transition hover:text-indigo-700 hover:underline"
        >
          ← Back to Login
        </button>
      </div>

    </div>
  </div>
)}

{/* Reset Password Modal */}
{resetToken && (
  <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-md">

    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/50 bg-white/90 p-8 shadow-2xl shadow-blue-950/20 backdrop-blur-2xl">

      {/* Decorative Background */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="relative">

        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl text-white shadow-lg shadow-blue-200">
          🔐
        </div>

        {/* Heading */}
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Reset Password
          </h2>

          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-blue-600" />

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Create a new secure password for your SportNest account.
          </p>
        </div>

        {/* Reset Password Form */}
        <form onSubmit={handleResetPassword} className="space-y-5">

          {/* New Password */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              New Password
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Confirm New Password
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Success Message */}
          {resetPasswordMessage && (
            <p className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {resetPasswordMessage}
            </p>
          )}

          {/* Error Message */}
          {resetPasswordError && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {resetPasswordError}
            </p>
          )}

          {/* Reset Button */}
          <button
            type="submit"
            disabled={isResettingPassword}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResettingPassword
              ? "Updating Password..."
              : "Reset Password"}
          </button>

        </form>

      </div>
    </div>
  </div>
)}


{/* Registration Modal */}
{showRegister && (
  <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-md">

    <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/40 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">


      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="relative">

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setShowRegister(false)}
          className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-600 transition hover:bg-red-100 hover:text-red-600"
        >
          ×
        </button>

        {/* Logo and Heading */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Sport<span className="text-blue-600">Nest.</span>
          </h2>

          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-blue-600" />

          <h3 className="mt-6 text-2xl font-black text-slate-900">
            Create Account
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Join SportNest and start your sports journey.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister}>

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              required
              value={registerDetails.name}
              onChange={(e) =>
                setRegisterDetails({
                  ...registerDetails,
                  name: e.target.value,
                })
              }
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              required
              value={registerDetails.email}
              onChange={(e) =>
                setRegisterDetails({
                  ...registerDetails,
                  email: e.target.value,
                })
              }
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Password
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={registerDetails.password}
              onChange={(e) =>
                setRegisterDetails({
                  ...registerDetails,
                  password: e.target.value,
                })
              }
              placeholder="Create a password"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Confirm Password
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={registerDetails.confirmPassword}
              onChange={(e) =>
                setRegisterDetails({
                  ...registerDetails,
                  confirmPassword: e.target.value,
                })
              }
              placeholder="Confirm your password"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {registerMessage && (
          <p className="text-green-600 text-sm">{registerMessage}</p>
           )}

          {registerError && (
          <p className="text-red-600 text-sm">{registerError}</p>
           )}

          <button
          type="submit"
          disabled={isRegistering}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
           >
          {isRegistering ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
            className="font-bold text-blue-600 hover:text-blue-800"
          >
            Login
          </button>
        </p>

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
