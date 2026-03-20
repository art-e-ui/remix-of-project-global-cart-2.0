// Mock reviews generator for product detail pages

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
}

const goodReviewTemplates = [
  { title: "Absolutely love it!", content: "This product exceeded my expectations. The quality is outstanding and it arrived well-packaged. Definitely recommending to friends and family." },
  { title: "Best purchase this year", content: "I've been looking for something like this for months. The build quality is exceptional and it works exactly as described. Worth every penny." },
  { title: "Highly recommended", content: "Great value for money. The product looks even better in person than in the photos. Fast shipping and excellent customer service too." },
  { title: "Perfect quality", content: "Impressive craftsmanship and attention to detail. This is my second purchase from this seller and I'm equally satisfied both times." },
  { title: "Exceeded expectations", content: "I was skeptical at first given the price point, but this product genuinely surprised me. Premium feel and great functionality." },
  { title: "Amazing product!", content: "Everything about this product is top-notch. From the packaging to the actual item, you can tell quality was a priority." },
  { title: "Five stars deserved", content: "Rarely do I leave reviews but this product truly deserves recognition. It's exactly what I needed and performs flawlessly." },
  { title: "Very satisfied customer", content: "The product arrived on time and in perfect condition. It matches the description perfectly. Will definitely buy again." },
  { title: "Great find", content: "Stumbled upon this while browsing and so glad I did. The quality-to-price ratio is unbeatable. Super happy with my purchase." },
  { title: "Wonderful purchase", content: "This has quickly become one of my favorite items. The design is sleek, functional, and durable. Couldn't ask for more." },
  { title: "Outstanding quality", content: "I've tried many similar products and this one stands out. The materials feel premium and the finish is impeccable." },
  { title: "Love everything about it", content: "From unboxing to daily use, this product delivers joy. It's practical, beautiful, and well-made. A perfect 5/5." },
  { title: "So impressed", content: "The attention to detail on this product is remarkable. Every feature works seamlessly. Truly a premium experience at a fair price." },
  { title: "Fantastic purchase", content: "Bought this as a gift and ended up getting one for myself too. That should tell you everything about the quality!" },
  { title: "Can't fault it", content: "Everything from ordering to delivery was smooth. The product itself is sturdy, well-designed, and looks fantastic. Highly recommended." },
];

const averageReviewTemplates = [
  { title: "Decent product", content: "It's okay for the price. Does what it's supposed to do but nothing extraordinary. The build quality could be slightly better." },
  { title: "Good but not perfect", content: "Overall a solid product with a few minor issues. The main functionality works well but some features feel a bit unfinished." },
  { title: "Meets expectations", content: "Got exactly what I expected based on the price point. It's functional and works as described. Nothing more, nothing less." },
  { title: "Average quality", content: "The product is fine for everyday use. It's not premium quality but it gets the job done. Packaging could be improved." },
  { title: "It's alright", content: "Not bad, not amazing. The product works as advertised but I've seen better options in this price range. Decent value overall." },
];

const badReviewTemplates = [
  { title: "Disappointed", content: "The product didn't meet my expectations. The quality feels cheap compared to what was shown in the photos. Considering returning it." },
  { title: "Not worth the price", content: "I expected much better quality for this price. The materials feel flimsy and it doesn't perform as well as described. Would not repurchase." },
  { title: "Could be much better", content: "Several issues right out of the box. The finish has imperfections and one feature doesn't work properly. Customer service was slow to respond." },
];

const authorNames = [
  "Alex M.", "Sarah K.", "James T.", "Emily R.", "Michael B.", "Jessica L.",
  "David W.", "Amanda P.", "Chris H.", "Natalie S.", "Ryan G.", "Olivia N.",
  "Daniel F.", "Sophia C.", "Brandon A.", "Rachel D.", "Kevin Z.", "Lisa Y.",
  "Andrew J.", "Megan V.", "Tyler E.", "Hannah Q.", "Jason U.", "Laura I.",
];

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateReviews(productId: string): Review[] {
  const seed = parseInt(productId, 10) || productId.charCodeAt(0);

  // 5-15 good, 5 average, 3 bad
  const goodCount = 5 + Math.floor(seededRandom(seed) * 11); // 5..15
  const avgCount = 5;
  const badCount = 3;

  const shuffledGood = shuffleWithSeed(goodReviewTemplates, seed);
  const shuffledAvg = shuffleWithSeed(averageReviewTemplates, seed + 100);
  const shuffledBad = shuffleWithSeed(badReviewTemplates, seed + 200);
  const shuffledNames = shuffleWithSeed(authorNames, seed + 300);

  const reviews: Review[] = [];
  let idx = 0;

  for (let i = 0; i < goodCount; i++) {
    const tmpl = shuffledGood[i % shuffledGood.length];
    reviews.push({
      id: `r-${productId}-${idx}`,
      author: shuffledNames[idx % shuffledNames.length],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${shuffledNames[idx % shuffledNames.length]}`,
      rating: seededRandom(seed + idx * 7) > 0.4 ? 5 : 4,
      date: `2026-${String(1 + (idx % 12)).padStart(2, "0")}-${String(1 + Math.floor(seededRandom(seed + idx) * 28)).padStart(2, "0")}`,
      title: tmpl.title,
      content: tmpl.content,
      helpful: Math.floor(seededRandom(seed + idx * 3) * 50),
    });
    idx++;
  }

  for (let i = 0; i < avgCount; i++) {
    const tmpl = shuffledAvg[i % shuffledAvg.length];
    reviews.push({
      id: `r-${productId}-${idx}`,
      author: shuffledNames[idx % shuffledNames.length],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${shuffledNames[idx % shuffledNames.length]}`,
      rating: 3,
      date: `2025-${String(1 + (idx % 12)).padStart(2, "0")}-${String(1 + Math.floor(seededRandom(seed + idx) * 28)).padStart(2, "0")}`,
      title: tmpl.title,
      content: tmpl.content,
      helpful: Math.floor(seededRandom(seed + idx * 3) * 20),
    });
    idx++;
  }

  for (let i = 0; i < badCount; i++) {
    const tmpl = shuffledBad[i % shuffledBad.length];
    reviews.push({
      id: `r-${productId}-${idx}`,
      author: shuffledNames[idx % shuffledNames.length],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${shuffledNames[idx % shuffledNames.length]}`,
      rating: seededRandom(seed + idx * 11) > 0.5 ? 2 : 1,
      date: `2025-${String(1 + (idx % 12)).padStart(2, "0")}-${String(1 + Math.floor(seededRandom(seed + idx) * 28)).padStart(2, "0")}`,
      title: tmpl.title,
      content: tmpl.content,
      helpful: Math.floor(seededRandom(seed + idx * 3) * 10),
    });
    idx++;
  }

  // Shuffle all reviews together
  return shuffleWithSeed(reviews, seed + 500);
}
