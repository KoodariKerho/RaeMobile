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
  email: string;
  friends: string[];
  id: string;
  photo: string;
  posts: string[];
  username: string;
}
