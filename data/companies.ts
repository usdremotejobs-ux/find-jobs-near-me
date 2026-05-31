export type Company = {
  id: string;
  name: string;
  logoUrl: string;
  category: string;
  area: string;
  latitude: number;
  longitude: number;
  hiring: boolean;
  updatedAt: string;
};

export const companies: Company[] = [
  { id: "razorpay", name: "Razorpay", logoUrl: "/logos/razorpay.svg", category: "Fintech", area: "Koramangala", latitude: 12.9337, longitude: 77.6143, hiring: true, updatedAt: "2026-05-22" },
  { id: "swiggy", name: "Swiggy", logoUrl: "/logos/swiggy.svg", category: "Consumer Internet", area: "HSR Layout", latitude: 12.9352, longitude: 77.6245, hiring: true, updatedAt: "2026-05-21" },
  { id: "zerodha", name: "Zerodha", logoUrl: "/logos/zerodha.svg", category: "Investing", area: "Indiranagar", latitude: 12.9784, longitude: 77.6408, hiring: true, updatedAt: "2026-05-20" },
  { id: "meesho", name: "Meesho", logoUrl: "/logos/meesho.svg", category: "E-commerce", area: "Koramangala", latitude: 12.9177, longitude: 77.6238, hiring: true, updatedAt: "2026-05-19" },
  { id: "groww", name: "Groww", logoUrl: "/logos/groww.svg", category: "Wealth Tech", area: "Bellandur", latitude: 12.9299, longitude: 77.6848, hiring: true, updatedAt: "2026-05-22" },
  { id: "phonepe", name: "PhonePe", logoUrl: "https://ui-avatars.com/api/?name=PhonePe&background=5f259f&color=fff&bold=true", category: "Fintech", area: "Bellandur", latitude: 12.925, longitude: 77.6765, hiring: true, updatedAt: "2026-05-18" },
  { id: "flipkart", name: "Flipkart", logoUrl: "https://ui-avatars.com/api/?name=Flipkart&background=2874f0&color=fff&bold=true", category: "E-commerce", area: "Bellandur", latitude: 12.9316, longitude: 77.6787, hiring: true, updatedAt: "2026-05-17" },
  { id: "cred", name: "CRED", logoUrl: "https://ui-avatars.com/api/?name=CRED&background=111827&color=fff&bold=true", category: "Fintech", area: "Indiranagar", latitude: 12.9719, longitude: 77.6412, hiring: true, updatedAt: "2026-05-20" },
  { id: "slice", name: "Slice", logoUrl: "https://ui-avatars.com/api/?name=Slice&background=00c2a8&color=111827&bold=true", category: "Fintech", area: "Koramangala", latitude: 12.9369, longitude: 77.6202, hiring: true, updatedAt: "2026-05-16" },
  { id: "unacademy", name: "Unacademy", logoUrl: "https://ui-avatars.com/api/?name=Unacademy&background=08bd80&color=fff&bold=true", category: "Edtech", area: "HSR Layout", latitude: 12.9121, longitude: 77.6446, hiring: true, updatedAt: "2026-05-15" },
  { id: "cultfit", name: "Cult.fit", logoUrl: "https://ui-avatars.com/api/?name=Cult.fit&background=ff3278&color=fff&bold=true", category: "Health Tech", area: "HSR Layout", latitude: 12.9118, longitude: 77.6385, hiring: true, updatedAt: "2026-05-15" },
  { id: "dailyhunt", name: "Dailyhunt", logoUrl: "https://ui-avatars.com/api/?name=Dailyhunt&background=f97316&color=fff&bold=true", category: "Media Tech", area: "Indiranagar", latitude: 12.9737, longitude: 77.6459, hiring: true, updatedAt: "2026-05-14" },
  { id: "sharechat", name: "ShareChat", logoUrl: "https://ui-avatars.com/api/?name=ShareChat&background=ef4444&color=fff&bold=true", category: "Social", area: "Koramangala", latitude: 12.9358, longitude: 77.6112, hiring: true, updatedAt: "2026-05-13" },
  { id: "zeta", name: "Zeta", logoUrl: "https://ui-avatars.com/api/?name=Zeta&background=2563eb&color=fff&bold=true", category: "Banking Tech", area: "Sarjapur Road", latitude: 12.9081, longitude: 77.6851, hiring: true, updatedAt: "2026-05-22" },
  { id: "postman", name: "Postman", logoUrl: "https://ui-avatars.com/api/?name=Postman&background=ff6c37&color=fff&bold=true", category: "Developer Tools", area: "Indiranagar", latitude: 12.9706, longitude: 77.6369, hiring: true, updatedAt: "2026-05-21" },
  { id: "whatfix", name: "Whatfix", logoUrl: "https://ui-avatars.com/api/?name=Whatfix&background=3b82f6&color=fff&bold=true", category: "SaaS", area: "HSR Layout", latitude: 12.9166, longitude: 77.6476, hiring: true, updatedAt: "2026-05-18" },
  { id: "freshworks", name: "Freshworks", logoUrl: "https://ui-avatars.com/api/?name=Freshworks&background=16a34a&color=fff&bold=true", category: "SaaS", area: "Mahadevapura", latitude: 12.9894, longitude: 77.6935, hiring: true, updatedAt: "2026-05-17" },
  { id: "zoho", name: "Zoho", logoUrl: "https://ui-avatars.com/api/?name=Zoho&background=dc2626&color=fff&bold=true", category: "SaaS", area: "Electronic City", latitude: 12.8399, longitude: 77.677, hiring: true, updatedAt: "2026-05-16" },
  { id: "inmobi", name: "InMobi", logoUrl: "https://ui-avatars.com/api/?name=InMobi&background=7c3aed&color=fff&bold=true", category: "Adtech", area: "Indiranagar", latitude: 12.9755, longitude: 77.6401, hiring: true, updatedAt: "2026-05-15" },
  { id: "apna", name: "Apna", logoUrl: "https://ui-avatars.com/api/?name=Apna&background=0ea5e9&color=fff&bold=true", category: "Jobs Platform", area: "Koramangala", latitude: 12.9341, longitude: 77.6266, hiring: true, updatedAt: "2026-05-14" },
  { id: "khatabook", name: "Khatabook", logoUrl: "https://ui-avatars.com/api/?name=Khatabook&background=2563eb&color=fff&bold=true", category: "Fintech", area: "HSR Layout", latitude: 12.9169, longitude: 77.6512, hiring: true, updatedAt: "2026-05-13" },
  { id: "smallcase", name: "smallcase", logoUrl: "https://ui-avatars.com/api/?name=smallcase&background=6366f1&color=fff&bold=true", category: "Investing", area: "Ashok Nagar", latitude: 12.9701, longitude: 77.6079, hiring: true, updatedAt: "2026-05-12" },
  { id: "navi", name: "Navi", logoUrl: "https://ui-avatars.com/api/?name=Navi&background=14b8a6&color=fff&bold=true", category: "Fintech", area: "Koramangala", latitude: 12.9413, longitude: 77.6162, hiring: true, updatedAt: "2026-05-12" },
  { id: "jupiter", name: "Jupiter", logoUrl: "https://ui-avatars.com/api/?name=Jupiter&background=f59e0b&color=111827&bold=true", category: "Neobank", area: "Indiranagar", latitude: 12.9709, longitude: 77.6491, hiring: true, updatedAt: "2026-05-11" },
  { id: "plum", name: "Plum", logoUrl: "https://ui-avatars.com/api/?name=Plum&background=9333ea&color=fff&bold=true", category: "Insurtech", area: "Koramangala", latitude: 12.9311, longitude: 77.6186, hiring: true, updatedAt: "2026-05-11" },
  { id: "springworks", name: "Springworks", logoUrl: "https://ui-avatars.com/api/?name=Springworks&background=22c55e&color=111827&bold=true", category: "HR Tech", area: "HSR Layout", latitude: 12.9142, longitude: 77.6347, hiring: true, updatedAt: "2026-05-10" },
  { id: "observeai", name: "Observe.AI", logoUrl: "https://ui-avatars.com/api/?name=Observe.AI&background=0891b2&color=fff&bold=true", category: "AI SaaS", area: "Bellandur", latitude: 12.9268, longitude: 77.6727, hiring: true, updatedAt: "2026-05-10" },
  { id: "yellowai", name: "Yellow.ai", logoUrl: "https://ui-avatars.com/api/?name=Yellow.ai&background=facc15&color=111827&bold=true", category: "AI SaaS", area: "JP Nagar", latitude: 12.9087, longitude: 77.5852, hiring: true, updatedAt: "2026-05-09" },
  { id: "locus", name: "Locus", logoUrl: "https://ui-avatars.com/api/?name=Locus&background=0f766e&color=fff&bold=true", category: "Logistics Tech", area: "HSR Layout", latitude: 12.9135, longitude: 77.6422, hiring: true, updatedAt: "2026-05-09" },
  { id: "dunzo", name: "Dunzo", logoUrl: "https://ui-avatars.com/api/?name=Dunzo&background=00d084&color=111827&bold=true", category: "Logistics", area: "Domlur", latitude: 12.9611, longitude: 77.6387, hiring: true, updatedAt: "2026-05-08" },
  { id: "porter", name: "Porter", logoUrl: "https://ui-avatars.com/api/?name=Porter&background=1d4ed8&color=fff&bold=true", category: "Logistics", area: "Domlur", latitude: 12.9547, longitude: 77.6408, hiring: true, updatedAt: "2026-05-08" },
  { id: "acko", name: "Acko", logoUrl: "https://ui-avatars.com/api/?name=Acko&background=7dd3fc&color=111827&bold=true", category: "Insurtech", area: "Indiranagar", latitude: 12.9674, longitude: 77.6419, hiring: true, updatedAt: "2026-05-07" },
  { id: "cleartrip", name: "Cleartrip", logoUrl: "https://ui-avatars.com/api/?name=Cleartrip&background=ea580c&color=fff&bold=true", category: "Travel Tech", area: "Bellandur", latitude: 12.9244, longitude: 77.6691, hiring: true, updatedAt: "2026-05-07" },
  { id: "nobroker", name: "NoBroker", logoUrl: "https://ui-avatars.com/api/?name=NoBroker&background=dc2626&color=fff&bold=true", category: "Proptech", area: "Marathahalli", latitude: 12.9569, longitude: 77.7011, hiring: true, updatedAt: "2026-05-06" },
  { id: "urbanpiper", name: "UrbanPiper", logoUrl: "https://ui-avatars.com/api/?name=UrbanPiper&background=4f46e5&color=fff&bold=true", category: "Restaurant SaaS", area: "Koramangala", latitude: 12.9286, longitude: 77.6294, hiring: true, updatedAt: "2026-05-06" },
  { id: "atlan", name: "Atlan", logoUrl: "https://ui-avatars.com/api/?name=Atlan&background=0f172a&color=fff&bold=true", category: "Data Platform", area: "Remote", latitude: 12.9716, longitude: 77.5946, hiring: true, updatedAt: "2026-05-05" },
];
