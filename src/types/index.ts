export type Role = "USER" | "ADMIN";

export type SpaceType = "DESK" | "MEETING_ROOM" | "CABIN";

export type BookingStatus = "CONFIRMED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  type: SpaceType;
  capacity: number;
  pricePerHour: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  spaceId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  space?: Space;
  user?: User;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
