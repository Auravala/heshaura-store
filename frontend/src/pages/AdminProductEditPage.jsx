import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowLeftRight, Star, Trash2 } from "lucide-react";
import { AnnouncementBar } from "../components/layout/AnnouncementBar";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Overline } from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";
import {
  adminDeleteImage,
  adminListProducts,
  adminReorderImages,
  adminReplaceImage,
  adminUpdateProduct,
  adminUploadImage,
} from "../services/api";
import { getProductImage } from "../data/images";
import { CATEGORIES } from "../data/products";

const MAX_IMAGES = 4;
const VALID_EXT = ["png", "jpg", "jpeg", "webp"];
const MAX_BYTES = 10 * 1024 * 1024;

const inputClass =
  "mt-2 w-full border border-brand-sand bg-brand-surface px-4 py-3 text-sm text-brand-charcoal outline-none transition-colors focus:border-brand-orange";
const labelClass = "text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-charcoal";

export default function AdminProductEditPage() {
  const { slug } = useParams();
  const { user, ready } = useAuth();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", mrp: "", stock: "", category: "", published: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [pending, setPending] = useState(null); // { file, preview, replaceIndex|null }
  const addInputRef = useRef(null);

  const applyProduct = (p) => {
    setProduct(p);
    setForm({
      name: p.name || "",
      price: p.price != null ? String(p.price) : "",
      mrp: p.mrp != null ? String(p.mrp) : "",
      stock: p.stock != null ? String(p.stock) : "",
      category: p.category || "",
      published: p.published !== false,
    });
  };

  useEffect(() => {
    if (!ready || user?.role !== "admin") {
      setLoading(false);
      return;
    }
    adminListProducts()
      .then((list) => {
        const found = list.find((p) => p.slug === slug);
        if (found) applyProduct(found);
        else setNotFound(true);
      })
      .catch(() => toast.error("Could not load the product."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user, slug]);

  const detail = (err, fallback) => err?.response?.data?.detail || fallback;

  const onSave = async () => {
    setSaving(true);
    try {
      const body = {
        name: form.name,
        category: form.category,
        published: form.published,
      };
      if (form.price !== "") body.price = Number(form.price);
      if (form.mrp !== "") body.mrp = Number(form.mrp);
      if (form.stock !== "") body.stock = Number(form.stock);
      const updated = await adminUpdateProduct(slug, body);
      applyProduct(updated);
      toast.success("Product saved.");
    } catch (err) {
      toast.error(detail(err, "Save failed."));
    } finally {
      setSaving(false);
    }
  };

  const pickFile = (file, replaceIndex = null) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!VALID_EXT.includes(ext)) {
      toast.error("Only PNG, JPG and WebP images are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image exceeds 10 MB.");
      return;
    }
    if (replaceIndex === null && (product.images || []).length >= MAX_IMAGES) {
      toast.error("Maximum 4 images per product.");
      return;
    }
    setPending({ file, preview: URL.createObjectURL(file), replaceIndex });
  };

  const cancelPending = () => {
    if (pending) URL.revokeObjectURL(pending.preview);
    setPending(null);
    if (addInputRef.current) addInputRef.current.value = "";
  };

  const savePending = async () => {
    if (!pending) return;
    setSaving(true);
    try {
      const updated =
        pending.replaceIndex === null
          ? await adminUploadImage(slug, pending.file)
          : await adminReplaceImage(slug, pending.replaceIndex, pending.file);
      applyProduct(updated);
      toast.success(pending.replaceIndex === null ? "Image added." : "Image replaced.");
    } catch (err) {
      toast.error(detail(err, "Image upload failed."));
    } finally {
      setSaving(false);
      cancelPending();
    }
  };

  const setMain = async (path) => {
    try {
      applyProduct(await adminUpdateProduct(slug, { main_image: path }));
      toast.success("Main image updated.");
    } catch (err) {
      toast.error(detail(err, "Could not set main image."));
    }
  };

  const move = async (index, dir) => {
    const images = [...(product.images || [])];
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    [images[index], images[target]] = [images[target], images[index]];
    try {
      applyProduct(await adminReorderImages(slug, images));
    } catch (err) {
      toast.error(detail(err, "Reorder failed."));
    }
  };

  const removeImage = async (index) => {
    try {
      applyProduct(await adminDeleteImage(slug, index));
      toast.success("Image deleted.");
    } catch (err) {
      toast.error(detail(err, "Delete failed."));
    }
  };

  const shell = (children) => (
    <div className="min-h-screen bg-brand-cream font-sans text-brand-charcoal">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16">{children}</main>
      <Footer />
    </div>
  );

  if (!ready || loading) return shell(<p className="font-serif text-2xl" data-testid="admin-edit-loading">Loading…</p>);
  if (!user || user.role !== "admin")
    return shell(<p className="font-serif text-2xl" data-testid="admin-denied">Admin access required.</p>);
  if (notFound || !product)
    return shell(<p className="font-serif text-2xl" data-testid="admin-edit-not-found">Product not found.</p>);

  const images = product.images || [];

  return shell(
    <div data-testid="admin-edit-page">
      <Link
        to="/admin"
        data-testid="admin-back-link"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-stone transition-colors hover:text-brand-orange"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Catalogue
      </Link>
      <Overline>Admin · Edit product</Overline>
      <h1 className="mt-4 font-serif text-4xl tracking-tight text-brand-charcoal">{product.name}</h1>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="admin-field-name" className={labelClass}>Name</label>
          <input id="admin-field-name" data-testid="admin-field-name" className={inputClass} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label htmlFor="admin-field-category" className={labelClass}>Category</label>
          <select id="admin-field-category" data-testid="admin-field-category" className={inputClass} value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="admin-field-price" className={labelClass}>Price (₹)</label>
          <input id="admin-field-price" data-testid="admin-field-price" type="number" min="0" className={inputClass}
            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Required before publishing" />
        </div>
        <div>
          <label htmlFor="admin-field-mrp" className={labelClass}>MRP (₹)</label>
          <input id="admin-field-mrp" data-testid="admin-field-mrp" type="number" min="0" className={inputClass}
            value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} />
        </div>
        <div>
          <label htmlFor="admin-field-stock" className={labelClass}>Stock</label>
          <input id="admin-field-stock" data-testid="admin-field-stock" type="number" min="0" className={inputClass}
            value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Required before publishing" />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-brand-charcoal">
            <input type="checkbox" data-testid="admin-field-published" className="h-4 w-4 accent-brand-orange"
              checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published (visible on storefront)
          </label>
        </div>
      </div>

      <button type="button" onClick={onSave} disabled={saving} data-testid="admin-save-button"
        className="mt-8 bg-brand-charcoal px-10 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange disabled:opacity-50">
        {saving ? "Saving…" : "Save product"}
      </button>

      <div className="mt-14">
        <Overline>Images ({images.length}/{MAX_IMAGES})</Overline>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {images.map((path, n) => (
            <div key={path} className="border border-brand-sand" data-testid={`admin-image-${n}`}>
              <div className="relative aspect-square bg-brand-sand/40">
                <img src={getProductImage(path, product.name).src} alt={`${product.name} view ${n + 1}`}
                  className="absolute inset-0 h-full w-full object-cover" />
                {product.image === path && (
                  <span className="absolute left-2 top-2 bg-brand-orange px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-brand-cream">
                    Main
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <button type="button" onClick={() => move(n, -1)} disabled={n === 0} data-testid={`admin-move-left-${n}`}
                  aria-label="Move earlier" className="text-brand-stone transition-colors hover:text-brand-orange disabled:opacity-30">
                  <ArrowLeftRight className="h-4 w-4" />
                </button>
                {product.image !== path && (
                  <button type="button" onClick={() => setMain(path)} data-testid={`admin-set-main-${n}`}
                    aria-label="Set as main" className="text-brand-stone transition-colors hover:text-brand-orange">
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <label className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-stone transition-colors hover:text-brand-orange"
                  data-testid={`admin-replace-${n}`}>
                  Replace
                  <input type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden"
                    onChange={(e) => { pickFile(e.target.files[0], n); e.target.value = ""; }} />
                </label>
                <button type="button" onClick={() => removeImage(n)} data-testid={`admin-delete-${n}`}
                  aria-label="Delete image" className="text-brand-stone transition-colors hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <button type="button" onClick={() => addInputRef.current?.click()} data-testid="admin-add-image"
              className="flex aspect-square flex-col items-center justify-center gap-2 border border-dashed border-brand-sand text-brand-stone transition-colors hover:border-brand-orange hover:text-brand-orange">
              <span className="font-serif text-3xl">+</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Add image</span>
            </button>
          )}
        </div>
        <input ref={addInputRef} type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden"
          data-testid="admin-add-image-input" onChange={(e) => pickFile(e.target.files[0], null)} />
      </div>

      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-charcoal/50 p-6" data-testid="admin-image-preview">
          <div className="w-full max-w-sm bg-brand-cream p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-charcoal">
              {pending.replaceIndex === null ? "Preview — new image" : "Preview — replacement image"}
            </p>
            <div className="relative mt-4 aspect-square bg-brand-sand/40">
              <img src={pending.preview} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <p className="mt-3 truncate text-xs text-brand-stone">{pending.file.name}</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={savePending} disabled={saving} data-testid="admin-image-save"
                className="flex-1 bg-brand-charcoal py-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange disabled:opacity-50">
                {saving ? "Saving…" : "Save image"}
              </button>
              <button type="button" onClick={cancelPending} data-testid="admin-image-cancel"
                className="flex-1 border border-brand-sand py-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-charcoal transition-colors hover:border-brand-orange">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
