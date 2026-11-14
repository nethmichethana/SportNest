
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/Product";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;

      const existingProduct = state.items.find(
        (item) => item._id === product._id
      );

      if (existingProduct) {
        if (existingProduct.quantity < existingProduct.stockQuantity) {
          existingProduct.quantity += 1;
        }
      } else if (product.stockQuantity > 0 && product.isActive) {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },

    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: string; change: number }>
    ) => {
      const item = state.items.find(
        (product) => product._id === action.payload.productId
      );

      if (item) {
        item.quantity = Math.max(
          1,
          Math.min(
            item.quantity + action.payload.change,
            item.stockQuantity
          )
        );
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
