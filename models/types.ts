export interface Products {
  id: number;
  productId: number;
  name: string;
  description: string;
  quantity: number;
  reservedQuantity: number;
  productPrice: number;
}

export interface Friend {
  attribute_values: {
    email: string;
    friends: string[];
    id: string;
    photo: string;
    posts: string[];
    username?: string;
  };
}

export interface Event {
  id: string;
  event_id: string;
  attendees: string[];
  availability: number[];
  companyMediaFilename: string;
  companyName: string;
  dateActualFrom: string;
  dateActualUntil: string;
  dateCreated: string;
  datePublishFrom: string;
  dateSalesFrom: string;
  dateSalesUntil: string;
  favoritedTimes: number;
  hasFreeInventoryItems: boolean;
  hasInventoryItems: boolean;
  isActual: boolean;
  maxPrice: object;
  mediaFilename: string;
  minPrice: object;
  name: string;
  place: string;
  pricingInformation: string;
  productType: number;
  salesEnded: boolean;
  salesOngoing: boolean;
  salesPaused: boolean;
  salesStarted: boolean;
  timeUntilActual: number;
  timeUntilSalesStart: number;
  photoUrl: string;
}

export interface Events {
  events: Event[];
}

export interface Friends {
  friends: Friend[];
}

export interface Language {
  language: string;
}
