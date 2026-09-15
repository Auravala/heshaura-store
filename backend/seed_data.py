# HESHAURA seed data — mirrors frontend/src/data/products.js (Account 2 mock) 1:1.
# IDs, slugs, prices, stock, flags, categories, image keys and variants are
# copied exactly. This file is the single source to rebuild the DB.

CATEGORIES = [
    {"id": "evil-eye", "label": "Evil Eye Bracelets"},
    {"id": "beaded", "label": "Beaded Bracelets"},
    {"id": "thread", "label": "Thread Bracelets"},
    {"id": "charm", "label": "Charm Bracelets"},
    {"id": "couple", "label": "Couple Bracelets"},
    {"id": "gift-sets", "label": "Gift Sets"},
]

PRODUCTS = [
    {
        "id": "p-evil-eye-classic",
        "slug": "classic-evil-eye-bracelet",
        "name": "Classic Evil Eye Bracelet",
        "price": 599,
        "mrp": 899,
        "stock": 12,
        "flags": {"featured": True, "bestseller": True, "newArrival": False},
        "category": "evil-eye",
        "image": "classic-evil-eye-bracelet",
        "materials": [],
        "createdAt": 3,
        "variants": [
            {
                "type": "color",
                "label": "Colour",
                "options": [
                    {"id": "blue", "label": "Blue", "stock": 6},
                    {"id": "black", "label": "Black", "stock": 4},
                    {"id": "white", "label": "White", "stock": 2},
                ],
            }
        ],
    },
    {
        "id": "p-evil-eye-nazar",
        "slug": "nazar-charm-evil-eye-bracelet",
        "name": "Nazar Charm Evil Eye Bracelet",
        "price": 699,
        "mrp": 999,
        "stock": 7,
        "flags": {"featured": False, "bestseller": True, "newArrival": False},
        "category": "evil-eye",
        "image": "nazar-charm-evil-eye-bracelet",
        "materials": [],
        "createdAt": 2,
    },
    {
        "id": "p-beaded-wooden",
        "slug": "wooden-bead-bracelet",
        "name": "Wooden Bead Bracelet",
        "price": 499,
        "mrp": 799,
        "stock": 20,
        "flags": {"featured": False, "bestseller": False, "newArrival": False},
        "category": "beaded",
        "image": "wooden-bead-bracelet",
        "materials": [],
        "createdAt": 1,
    },
    {
        "id": "p-beaded-lava",
        "slug": "lava-stone-beaded-bracelet",
        "name": "Lava Stone Beaded Bracelet",
        "price": 749,
        "mrp": 1099,
        "stock": 5,
        "flags": {"featured": False, "bestseller": False, "newArrival": True},
        "category": "beaded",
        "image": "lava-stone-beaded-bracelet",
        "materials": [],
        "createdAt": 9,
        "variants": [
            {
                "type": "size",
                "label": "Bracelet Size",
                "options": [
                    {"id": "s", "label": "Small", "stock": 1},
                    {"id": "m", "label": "Medium", "stock": 3},
                    {"id": "l", "label": "Large", "stock": 1},
                ],
            }
        ],
    },
    {
        "id": "p-thread-red",
        "slug": "red-protection-thread-bracelet",
        "name": "Red Protection Thread Bracelet",
        "price": 299,
        "mrp": 499,
        "stock": 40,
        "flags": {"featured": False, "bestseller": True, "newArrival": False},
        "category": "thread",
        "image": "red-protection-thread-bracelet",
        "materials": [],
        "createdAt": 1,
    },
    {
        "id": "p-thread-black",
        "slug": "adjustable-black-thread-bracelet",
        "name": "Adjustable Black Thread Bracelet",
        "price": 349,
        "mrp": 599,
        "stock": 0,
        "flags": {"featured": False, "bestseller": False, "newArrival": False},
        "category": "thread",
        "image": "adjustable-black-thread-bracelet",
        "materials": [],
        "createdAt": 1,
    },
    {
        "id": "p-charm-heart",
        "slug": "heart-charm-bracelet",
        "name": "Heart Charm Bracelet",
        "price": 649,
        "mrp": 949,
        "stock": 9,
        "flags": {"featured": True, "bestseller": False, "newArrival": False},
        "category": "charm",
        "image": "heart-charm-bracelet",
        "materials": [],
        "createdAt": 4,
        "variants": [
            {
                "type": "charm",
                "label": "Charm",
                "options": [
                    {"id": "heart", "label": "Heart"},
                    {"id": "star", "label": "Star"},
                    {"id": "moon", "label": "Moon"},
                ],
            }
        ],
    },
    {
        "id": "p-charm-infinity",
        "slug": "infinity-charm-bracelet",
        "name": "Infinity Charm Bracelet",
        "price": 699,
        "mrp": 999,
        "stock": 3,
        "flags": {"featured": False, "bestseller": False, "newArrival": True},
        "category": "charm",
        "image": "infinity-charm-bracelet",
        "materials": [],
        "createdAt": 8,
    },
    {
        "id": "p-couple-his-hers",
        "slug": "his-and-hers-couple-bracelet-set",
        "name": "His & Hers Couple Bracelet Set",
        "price": 1199,
        "mrp": 1799,
        "stock": 6,
        "flags": {"featured": True, "bestseller": True, "newArrival": False},
        "category": "couple",
        "image": "his-and-hers-couple-bracelet-set",
        "materials": [],
        "createdAt": 5,
        "variants": [
            {
                "type": "color",
                "label": "Colour",
                "options": [
                    {"id": "black", "label": "Black", "stock": 4},
                    {"id": "brown", "label": "Brown", "stock": 2},
                ],
            }
        ],
    },
    {
        "id": "p-couple-magnetic",
        "slug": "magnetic-couple-bracelets",
        "name": "Magnetic Couple Bracelets",
        "price": 999,
        "mrp": 1499,
        "stock": 4,
        "flags": {"featured": False, "bestseller": False, "newArrival": True},
        "category": "couple",
        "image": "magnetic-couple-bracelets",
        "materials": [],
        "createdAt": 7,
    },
    {
        "id": "p-gift-aura-set",
        "slug": "aura-gift-set",
        "name": "Aura Gift Set",
        "price": 1499,
        "mrp": 2199,
        "stock": 5,
        "flags": {"featured": True, "bestseller": False, "newArrival": False},
        "category": "gift-sets",
        "image": "aura-gift-set",
        "materials": [],
        "createdAt": 6,
    },
    {
        "id": "p-gift-blessings-box",
        "slug": "blessings-gift-box",
        "name": "Blessings Gift Box",
        "price": 1999,
        "mrp": 2999,
        "stock": 2,
        "flags": {"featured": False, "bestseller": True, "newArrival": False},
        "category": "gift-sets",
        "image": "blessings-gift-box",
        "materials": [],
        "createdAt": 6,
    },
]

# Passwords are read from env at seed time (SEED_OWNER_PASSWORD /
# SEED_CUSTOMER_PASSWORD); a user is skipped when its env var is unset.
SEED_USERS = [
    {"name": "Shaiilesh Vala", "email": "shaiileshvala@gmail.com", "password_env": "SEED_OWNER_PASSWORD", "role": "admin"},
    {"name": "Test Customer", "email": "customer@heshaura.in", "password_env": "SEED_CUSTOMER_PASSWORD", "role": "customer"},
]


def _draft(slug: str, name: str, category: str, filenames: list, created_at: int) -> dict:
    # image_files are the ordered original filenames (main, angle, close-up, wrist)
    # used once at seed time to upload to object storage; images/image stay empty
    # until that upload runs so admin edits are never overwritten by re-seeding.
    return {
        "id": f"p-{slug}",
        "slug": slug,
        "name": name,
        "price": None,
        "mrp": None,
        "stock": None,
        "flags": {"featured": False, "bestseller": False, "newArrival": False},
        "category": category,
        "image": "",
        "images": [],
        "image_files": filenames,
        "materials": [],
        "createdAt": created_at,
        "published": False,
    }


# Account 4 draft catalog — unpublished until price/stock are set via Admin Panel.
# Image order: main/front, angle, close-up, wrist (verified visually).
DRAFT_PRODUCTS = [
    _draft("aqua-star-charm-bracelet", "Aqua Star Charm Bracelet", "charm", [
        "Aqua Star Charm Bracelet 4.png",
        "Aqua Star Charm Bracelet 2.png",
        "Aqua Star Charm Bracelet 3.png",
    ], 20),
    _draft("celestia-silver-bracelet", "Celestia Silver Bracelet", "charm", [
        "Celestia Silver Bracelet 1.png",
        "Celestia Silver Bracelet 2.png",
        "Celestia Silver Bracelet 3.png",
        "Celestia Silver Bracelet 4.png",
    ], 21),
    _draft("evergreen-daisy-bracelet", "Evergreen Daisy Bracelet", "charm", [
        "Emerald Daisy Charm Bracelet 2.png",
        "Emerald Daisy Charm Bracelet 1.png",
        "Emerald Daisy Charm Bracelet 3.png",
        "Evergreen Daisy Bracelet.png",
    ], 22),
    _draft("lunara-heart-tennis-bracelet", "Lunara Heart Tennis Bracelet", "charm", [
        "Lunara Heart Tennis Bracelet 3.png",
        "Lunara Heart Tennis Bracelet 2.png",
        "Lunara Heart Tennis Bracelet 4.png",
        "Lunara Heart Tennis Bracelet 1.png",
    ], 23),
    _draft("mystic-unicorn-bead-bracelet", "Mystic Unicorn Bead Bracelet", "beaded", [
        "Mystic Unicorn Bead Bracelet 1.png",
        "Mystic Unicorn Bead Bracelet 2.png",
        "Mystic Unicorn Bead Bracelet 3.png",
        "Mystic Unicorn Bead Bracelet 4.png",
    ], 24),
    _draft("olive-crown-charm-bracelet", "Olive Crown Charm Bracelet", "charm", [
        "Olive Crown Charm Bracelet 3.png",
        "Olive Crown Charm Bracelet 1.png",
        "Olive Crown Charm Bracelet 2.png",
        "Olive Crown Charm Bracelet 4.png",
    ], 25),
    _draft("pink-princess-unicorn-bracelet", "Pink Princess Unicorn Bracelet", "beaded", [
        "Pink Princess Unicorn Bracelet 3.png",
        "Pink Princess Unicorn Bracelet 4.png",
        "Pink Princess Unicorn Bracelet.png",
        "Pink Princess Unicorn Bracelet 2.png",
    ], 26),
    _draft("rosella-dream-bracelet", "Rosella Dream Bracelet", "charm", [
        "Rosella Dream Bracelet 1.png",
        "Rosella Dream Bracelet 2.png",
        "Rosella Dream Bracelet 4.png",
        "Rosella Dream Bracelet 3.png",
    ], 27),
    _draft("seafoam-leaf-bracelet", "Seafoam Leaf Bracelet", "charm", [
        "Seafoam Leaf Bracelet 3.png",
        "Seafoam Leaf Bracelet 2.png",
        "Seafoam Leaf Bracelet 1.png",
    ], 28),
    _draft("silver-bell-cluster-bracelet", "Silver Bell Cluster Bracelet", "thread", [
        "Silver Bell Cluster Bracelet.png",
        "Silver Bell Cluster Bracelet 1.png",
        "Silver Bell Cluster Bracelet 3.png",
        "Silver Bell Cluster Bracelet 4.png",
    ], 29),
    _draft("tiger-evileye-bracelet", "Tiger EvilEye Bracelet", "evil-eye", [
        "Tiger EvilEye Bracelet.png",
        "Tiger EvilEye Bracelet 2.png",
        "Tiger EvilEye Bracelet 3.png",
        "Tiger EvilEye Bracelet 4.png",
    ], 30),
]
