export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  promotional_price: number | null;
  duration_days: number;
  duration_label: string | null;
  devices: number;
  quality: string | null;
  features: string[];
  badge: string | null;
  highlighted: boolean;
  button_text: string | null;
  payment_enabled: boolean;
  whatsapp_enabled: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  desktop_image: string | null;
  mobile_image: string | null;
  button_text: string | null;
  button_url: string | null;
}

export interface CatalogItem {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  year: number | null;
  rating: string | null;
  tags: string[];
  featured: boolean;
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  items: CatalogItem[];
}

export interface Benefit {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
}

export interface DeviceItem {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  avatar: string | null;
  rating: number | null;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface SiteSettings {
  name: string;
  logo_text: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  seo_title: string;
  seo_description: string;
}

export interface WhatsappSettings {
  enabled: boolean;
  float_button: boolean;
  number: string;
  button_text: string;
  default_message: string;
  post_payment_message: string;
}

export interface HeaderSettings {
  cta_text: string;
  menu: { label: string; href: string }[];
}

export interface ContactSettings {
  email: string;
  phone: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export interface FooterSettings {
  description: string;
  copyright: string;
}

export interface HowItWorksSettings {
  title: string;
  subtitle: string;
  steps: { title: string; description: string }[];
}

export interface LandingContent {
  site: SiteSettings;
  whatsapp: WhatsappSettings;
  header: HeaderSettings;
  contact: ContactSettings;
  footer: FooterSettings;
  howItWorks: HowItWorksSettings;
  plans: Plan[];
  banners: Banner[];
  categories: CatalogCategory[];
  benefits: Benefit[];
  devices: DeviceItem[];
  testimonials: Testimonial[];
  faqs: Faq[];
}
