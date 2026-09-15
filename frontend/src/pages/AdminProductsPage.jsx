import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnnouncementBar } from "../components/layout/AnnouncementBar";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Overline } from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";
import { adminListProducts } from "../services/api";
import { getProductImage } from "../data/images";
import { CATEGORY_LABEL } from "../data/products";
import { formatINR } from "../data/content";

const Shell = ({ children }) => (
  <div className="min-h-screen bg-brand-cream font-sans text-brand-charcoal">
    <AnnouncementBar />
    <Header />
    <main className="mx-auto max-w-6xl px-6 py-16">{children}</main>
    <Footer />
  </div>
);

export default function AdminProductsPage() {
  const { user, ready } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (user?.role !== "admin") {
      setLoading(false);
      return;
    }
    adminListProducts()
      .then((list) => {
        setProducts(list);
        setError("");
      })
      .catch(() => setError("We couldn't load the catalogue."))
      .finally(() => setLoading(false));
  }, [ready, user]);

  if (!ready || loading) {
    return (
      <Shell>
        <p className="font-serif text-2xl text-brand-charcoal" data-testid="admin-loading">Loading…</p>
      </Shell>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <Shell>
        <p className="font-serif text-2xl text-brand-charcoal" data-testid="admin-denied">Admin access required.</p>
        <p className="mt-2 text-sm text-brand-stone">
          Sign in with the owner account via the <Link to="/login" className="text-brand-orange underline-offset-4 hover:underline">login page</Link>.
        </p>
      </Shell>
    );
  }

  const drafts = products.filter((p) => p.published === false);
  const live = products.filter((p) => p.published !== false);

  return (
    <Shell>
      <div data-testid="admin-products-page">
        <Overline>Admin</Overline>
        <h1 className="mt-4 font-serif text-4xl tracking-tight text-brand-charcoal">Catalogue</h1>
        <p className="mt-3 text-sm text-brand-stone" data-testid="admin-counts">
          {drafts.length} draft{drafts.length === 1 ? "" : "s"} · {live.length} published
        </p>
        {error && <p className="mt-4 text-sm font-medium text-destructive" data-testid="admin-error">{error}</p>}

        <div className="mt-10 overflow-x-auto" data-testid="admin-products-table">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-sand text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-stone">
                <th className="py-3 pr-4">Image</th>
                <th className="py-3 pr-4">Product</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Stock</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3" />
              </tr>
            </thead>
            <tbody>
              {[...drafts, ...live].map((p) => (
                <tr key={p.slug} className="border-b border-brand-sand/60" data-testid={`admin-product-row-${p.slug}`}>
                  <td className="py-3 pr-4">
                    <div className="h-14 w-14 overflow-hidden bg-brand-sand/40">
                      {p.image ? (
                        <img src={getProductImage(p.image, p.name).src} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center font-serif text-brand-orange/60">H</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-medium text-brand-charcoal">{p.name}</td>
                  <td className="py-3 pr-4 text-brand-stone">{CATEGORY_LABEL[p.category] || p.category}</td>
                  <td className="py-3 pr-4 text-brand-charcoal">{p.price != null ? formatINR(p.price) : "—"}</td>
                  <td className="py-3 pr-4 text-brand-charcoal">{p.stock != null ? p.stock : "—"}</td>
                  <td className="py-3 pr-4">
                    <span
                      data-testid={`admin-status-${p.slug}`}
                      className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        p.published === false ? "bg-brand-gold/30 text-brand-charcoal" : "bg-brand-orange/10 text-brand-orange"
                      }`}
                    >
                      {p.published === false ? "Draft" : "Published"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      to={`/admin/products/${p.slug}`}
                      data-testid={`admin-edit-link-${p.slug}`}
                      className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange underline-offset-4 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
