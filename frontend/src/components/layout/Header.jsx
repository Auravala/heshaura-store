import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, User, Wallet, X } from "lucide-react";
import { BRAND, MEGA_MENU, NAV_LINKS } from "../../data/content";
import { IMAGES } from "../../data/images";
import { ImageSlot } from "../ImageSlot";
import { useCart } from "../../context/CartContext";
import { CART } from "../../constants/testIds/shop";
import { LOGOUT } from "../../constants/testIds/auth";
import { useAuth } from "../../context/AuthContext";

const MegaMenu = ({ onNavigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="absolute inset-x-0 top-full border-b border-brand-sand bg-brand-surface shadow-[0_24px_48px_-24px_rgba(28,25,23,0.25)]"
    data-testid="mega-menu"
  >
    <div className="mx-auto grid max-w-7xl grid-cols-4 gap-10 px-6 py-10 lg:px-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-stone">Shop by Category</p>
        <ul className="mt-5 space-y-3">
          {MEGA_MENU.categories.map((c) => (
            <li key={c.label}>
              <Link
                to="/shop"
                onClick={onNavigate}
                className="font-serif text-lg text-brand-charcoal transition-colors hover:text-brand-orange"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-stone">Edits</p>
        <ul className="mt-5 space-y-3">
          {MEGA_MENU.edits.map((c) => (
            <li key={c.label}>
              <Link
                to="/shop"
                onClick={onNavigate}
                className="text-sm text-brand-charcoal/80 transition-colors hover:text-brand-orange"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-2">
        <Link to="/shop" onClick={onNavigate} className="group block" data-testid="mega-menu-featured">
          <ImageSlot
            name="mega-menu-featured"
            label={MEGA_MENU.featured.title}
            src={IMAGES.megaMenu.featured.src}
            alt={IMAGES.megaMenu.featured.alt}
            ratio="aspect-[16/8]"
            className="transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <p className="mt-4 font-serif text-xl text-brand-charcoal">{MEGA_MENU.featured.title}</p>
          <p className="mt-1 text-sm text-brand-stone">{MEGA_MENU.featured.note}</p>
          <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
            {MEGA_MENU.featured.cta} →
          </span>
        </Link>
      </div>
    </div>
  </motion.div>
);

const MobileMenu = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex flex-col bg-brand-cream lg:hidden"
        data-testid="mobile-menu"
      >
        <div className="flex items-center justify-between border-b border-brand-sand px-5 py-4">
          <span className="font-serif text-xl tracking-[0.3em] text-brand-charcoal">{BRAND.name}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            data-testid="mobile-menu-close-button"
            className="flex h-10 w-10 items-center justify-center text-brand-charcoal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-5 py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-stone">Shop</p>
          <ul className="mt-4 space-y-1">
            {MEGA_MENU.categories.map((c) => (
              <li key={c.label}>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="block py-2.5 font-serif text-3xl text-brand-charcoal transition-colors hover:text-brand-orange"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="my-8 h-px bg-brand-sand" />
          <ul className="space-y-1">
            {MEGA_MENU.edits.map((c) => (
              <li key={c.label}>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="block py-2 text-base text-brand-charcoal/80 transition-colors hover:text-brand-orange"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-brand-sand px-5 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-orange">{BRAND.offer}</p>
          <p className="mt-1 text-sm text-brand-stone">Wallet credit of {BRAND.referralReward} on every referral.</p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const Header = () => {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-brand-sand bg-brand-cream/95 backdrop-blur-sm"
        onMouseLeave={() => setMegaOpen(false)}
      >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          data-testid="mobile-menu-button"
          className="flex h-10 w-10 items-center justify-center text-brand-charcoal lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden h-full items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) =>
            link.mega ? (
              <button
                key={link.label}
                type="button"
                data-testid="mega-menu-trigger"
                onMouseEnter={() => setMegaOpen(true)}
                onClick={() => {
                  setMegaOpen(false);
                  navigate("/shop");
                }}
                className={`h-full text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  megaOpen ? "text-brand-orange" : "text-brand-charcoal hover:text-brand-orange"
                }`}
              >
                {link.label}
              </button>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-charcoal transition-colors hover:text-brand-orange"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
        <AnimatePresence>{megaOpen && <MegaMenu onNavigate={() => setMegaOpen(false)} />}</AnimatePresence>

        <Link
          to="/"
          data-testid="header-logo"
          className="absolute left-1/2 -translate-x-1/2 text-center"
          aria-label="HESHAURA home"
        >
          <span className="font-serif text-xl tracking-[0.35em] text-brand-charcoal sm:text-2xl">{BRAND.name}</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <span className="hidden items-center gap-2 sm:flex" data-testid="header-account-state">
              <span className="text-xs font-semibold text-brand-charcoal" data-testid="header-account-name">
                Hi, {(user.name || "there").split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={logout}
                data-testid={LOGOUT.button}
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-stone transition-colors hover:text-brand-orange"
              >
                Logout
              </button>
            </span>
          ) : (
            <Link
              to="/login"
              aria-label="Account"
              data-testid="header-account-link"
              className="flex h-10 w-10 items-center justify-center text-brand-charcoal transition-colors hover:text-brand-orange"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>
          )}
          <button
            type="button"
            aria-label="Search"
            data-testid="search-trigger-button"
            className="flex h-10 w-10 items-center justify-center text-brand-charcoal transition-colors hover:text-brand-orange"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            data-testid="wallet-preview-badge"
            className="hidden items-center gap-1.5 border border-brand-sand px-3 py-1.5 text-xs font-semibold text-brand-charcoal transition-colors hover:border-brand-orange hover:text-brand-orange sm:flex"
          >
            <Wallet className="h-3.5 w-3.5 text-brand-orange" />
            {BRAND.referralReward}
          </button>
          <button
            type="button"
            aria-label="Shopping bag"
            data-testid="bag-button"
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center text-brand-charcoal transition-colors hover:text-brand-orange"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {itemCount > 0 && (
              <span
                data-testid={CART.count}
                className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[9px] font-bold text-brand-cream"
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};
