import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/Product";

interface ProductState {
  items: Product[];
}

const initialState: ProductState = {
  items: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },

    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },

    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(
        (product) => product._id === action.payload._id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (product) => product._id !== action.payload
      );
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
} = productSlice.actions;

export default productSlice.reducer;