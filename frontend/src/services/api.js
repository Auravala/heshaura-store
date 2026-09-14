import axios from "axios";
import { PRODUCTS, getProductBySlug } from "../data/products";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Dev-only safety net: fall back to the local Account 2 mock data when the
// API is unreachable. Disabled in production builds.
const DEV_FALLBACK = process.env.NODE_ENV === "development";

export const fetchProducts = async (params = {}) => {
  try {
    const { data } = await axios.get(`${API}/products`, { params });
    return data;
  } catch (err) {
    if (DEV_FALLBACK) return PRODUCTS;
    throw err;
  }
};

export const fetchProductBySlug = async (slug) => {
  try {
    const { data } = await axios.get(`${API}/products/${encodeURIComponent(slug)}`);
    return data;
  } catch (err) {
    if (DEV_FALLBACK && err?.response?.status !== 404) {
      const local = getProductBySlug(slug);
      if (local) return local;
    }
    throw err;
  }
};
