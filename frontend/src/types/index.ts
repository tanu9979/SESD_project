export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  countryCode: string;
  currencyCode: string;
  avgRating: number;
  createdAt: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  condition: string;
  price: number;
  type: 'sell' | 'rent' | 'both' | 'donate';
  status: string;
  image?: string;
  description?: string;
  sellerInsights?: string;
  donorNote?: string;
  sellerPincode?: string;
  examTags: ExamTag[];
  owner: User;
  createdAt: string;
}

export interface ExamTag {
  _id: string;
  name: string;
  category: string;
  countryCode: string;
}

export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  _id: string;
  buyer: User;
  book: Book;
  address: Address;
  totalAmount: number;
  status: string;
  estimatedDelivery?: string;
  confirmedAt?: string;
  shippedAt?: string;
  outForDeliveryAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface Rental {
  _id: string;
  renter: User;
  book: Book;
  startDate: string;
  endDate: string;
  returnedDate?: string;
  dailyRate: number;
  totalAmount: number;
  status: 'active' | 'returned' | 'overdue';
}

export interface Rating {
  _id: string;
  reviewer: User;
  seller: User;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: User;
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface Conversation {
  _id: string;
  buyer: User;
  seller: User;
  book: Book;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
