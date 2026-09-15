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

const TOKEN_KEY = "heshaura_token_v1";
const authHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminListProducts = async () =>
  (await axios.get(`${API}/admin/products`, { headers: authHeaders() })).data;

export const adminUpdateProduct = async (slug, body) =>
  (await axios.patch(`${API}/admin/products/${encodeURIComponent(slug)}`, body, { headers: authHeaders() })).data;

export const adminUploadImage = async (slug, file) => {
  const form = new FormData();
  form.append("file", file);
  return (await axios.post(`${API}/admin/products/${encodeURIComponent(slug)}/images`, form, { headers: authHeaders() })).data;
};

export const adminReplaceImage = async (slug, index, file) => {
  const form = new FormData();
  form.append("file", file);
  return (await axios.post(`${API}/admin/products/${encodeURIComponent(slug)}/images/${index}/replace`, form, { headers: authHeaders() })).data;
};

export const adminDeleteImage = async (slug, index) =>
  (await axios.delete(`${API}/admin/products/${encodeURIComponent(slug)}/images/${index}`, { headers: authHeaders() })).data;

export const adminReorderImages = async (slug, images) =>
  (await axios.post(`${API}/admin/products/${encodeURIComponent(slug)}/images/reorder`, { images }, { headers: authHeaders() })).data;
