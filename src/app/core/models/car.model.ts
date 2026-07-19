export interface Brand {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  founded: number;
  headquarters: string;
  description: string;
  monogram: string;
  modelCount: number;
  /** Optional path under src/assets/img/brands/ — see README §8 for sourcing real logos. */
  logoPath?: string;
}

export interface Variant {
  name: string;
  exShowroomPrice: number;
}

export interface CarSpecs {
  engine: string;
  power: string;
  torque: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  seating: number | string;
  bootSpace: string;
  safety: string;
}

export interface Review {
  author: string;
  location: string;
  rating: number;
  title: string;
  text: string;
  date: string;
}

export interface SparePart {
  name: string;
  priceRange: string;
}

export interface SparePartsInfo {
  authorizedServiceNote: string;
  commonParts: SparePart[];
  tip: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface CarModel {
  slug: string;
  brandSlug: string;
  name: string;
  bodyType: string;
  launchYear: number;
  rating: number;
  reviewCount: number;
  heroColor: string;
  /** Optional paths under src/assets/img/cars/<brandSlug>/ — see README §8 for sourcing real photos. */
  images?: string[];
  exShowroomMin: number;
  exShowroomMax: number;
  onRoadApproxDelhi: number;
  downPaymentSuggested: number;
  emiApprox: number;
  emiTenureMonths: number;
  specs: CarSpecs;
  variants: Variant[];
  colors: string[];
  reviews: Review[];
  spareParts: SparePartsInfo;
  faqs: Faq[];
}
