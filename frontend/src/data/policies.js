// HESHAURA — rule/policy configuration (Account 2).
//
// DISPLAY-ONLY & NON-AUTHORITATIVE.
// These values exist so the storefront can *show* the customer what to expect.
// Nothing here is enforced on the client. No discount stacking, wallet caps,
// expiry, referral gating or minimum-order blocking happens in this phase —
// real enforcement lands server-side in a later phase. Any preview math built
// from these numbers must be clearly labelled as indicative only.
//
// Shaped as a flat, serializable object so it maps 1:1 to a future API/CMS
// response without touching components.

export const POLICIES = {
  firstOrderDiscount: 33, // percent off the first order (display only)
  referralReward: 333, // ₹ store credit per successful referral (display only)
  walletMaxUsage: 20, // max percent of an order payable via wallet credit (display only)
  minOrderValue: 999, // ₹ minimum order value applied at checkout (display only)
  rewardExpiryDays: 180, // days until referral/wallet credit expires (display only)
};

// Human-readable, pre-formatted strings for direct rendering.
export const POLICY_LABELS = {
  firstOrderDiscount: `${POLICIES.firstOrderDiscount}% off your first order`,
  referralReward: `₹${POLICIES.referralReward} per referral`,
  walletMaxUsage: `up to ${POLICIES.walletMaxUsage}% of order value`,
  minOrderValue: `₹${POLICIES.minOrderValue.toLocaleString("en-IN")}`,
  rewardExpiryDays: `${POLICIES.rewardExpiryDays} days`,
};

// Single source of truth for the "this is a preview, not a promise" wording.
export const NON_AUTHORITATIVE_NOTE =
  "Indicative only. Discounts, wallet credit and shipping are calculated and verified at checkout in a later phase.";
