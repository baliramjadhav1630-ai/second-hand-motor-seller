export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  location?: string;
  created_at?: string;
}

export interface VehicleSpec {
  id?: string;
  vehicle_id?: string;
  horsepower: number;
  top_speed: number;
  acceleration: number;
  range_or_mpg: string;
  drivetrain: string;
  battery_capacity?: string;
  battery_health?: number;
}

export interface VehicleImage {
  id?: string;
  vehicle_id?: string;
  url: string;
  is_primary: boolean | number;
  caption?: string;
  order_index?: number;
}

export interface VehicleHotspot {
  id?: string;
  vehicle_id?: string;
  label: string;
  title: string;
  description: string;
  x: number;
  y: number;
  z: number;
  category: 'powertrain' | 'aero' | 'brakes' | 'interior' | 'battery';
}

export interface ServiceRecord {
  id?: string;
  vehicle_id?: string;
  date: string;
  mileage: number;
  service_type: string;
  description: string;
  verified: boolean | number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  body_type: string;
  exterior_color: string;
  interior_color: string;
  vin: string;
  registration?: string;
  location: string;
  condition_score: number;
  title_status: string;
  description: string;
  is_certified: boolean | number;
  is_featured: boolean | number;
  status: 'active' | 'paused' | 'sold';
  seller_id: string;
  model_3d_type?: 'cyber_coupe' | 'hyper_ev' | 'm_spec' | 'sport_suv' | 'gran_turismo';
  created_at?: string;
  updated_at?: string;
  primary_image?: string;
  images?: VehicleImage[];
  specs?: VehicleSpec;
  hotspots?: VehicleHotspot[];
  service_records?: ServiceRecord[];
  seller_name?: string;
  seller_email?: string;
  seller_phone?: string;
  seller_role?: string;
  seller_avatar?: string;
  seller_location?: string;
  is_favorited?: boolean;
}

export interface Inquiry {
  id: string;
  vehicle_id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  type: 'inquiry' | 'test_drive' | 'offer';
  message: string;
  offer_amount?: number;
  preferred_date?: string;
  preferred_time_slot?: string;
  status: 'pending' | 'accepted' | 'declined' | 'contacted';
  created_at?: string;
  make?: string;
  model?: string;
  year?: number;
  price?: number;
  vehicle_image?: string;
}

export interface FilterState {
  q: string;
  make: string;
  model: string;
  bodyType: string;
  fuel: string;
  transmission: string;
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  maxMileage: number;
  isCertified: boolean;
  sort: string;
}
