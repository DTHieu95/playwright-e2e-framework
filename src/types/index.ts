export interface User {
  username: string;
  password: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds: string;
}

export type Booking = BookingPayload;

export interface CreateBookingResponse {
  bookingid: number;
  booking: Booking;
}

export type SortOption =
  | 'az' // Name (A to Z)
  | 'za' // Name (Z to A)
  | 'lohi' // Price (low to high)
  | 'hilo'; // Price (high to low)
