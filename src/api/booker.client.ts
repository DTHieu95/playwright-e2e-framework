import { expect, type APIRequestContext } from '@playwright/test';
import type { Booking, BookingPayload, CreateBookingResponse } from '@/types';

const ADMIN = { username: 'admin', password: 'password123' };

export class BookerClient {
  private token?: string;

  constructor(private readonly request: APIRequestContext) {}

  async authenticate(): Promise<void> {
    const res = await this.request.post('/auth', { data: ADMIN });
    expect(res.ok(), 'auth request should succeed').toBeTruthy();
    const body = (await res.json()) as { token?: string };
    if (!body.token) {
      throw new Error('Authentication did not return a token');
    }
    this.token = body.token;
  }

  async createBooking(payload: BookingPayload): Promise<CreateBookingResponse> {
    const res = await this.request.post('/booking', { data: payload });
    expect(res.ok(), 'createBooking should succeed').toBeTruthy();
    return (await res.json()) as CreateBookingResponse;
  }

  async getBooking(id: number): Promise<Booking> {
    const res = await this.request.get(`/booking/${id}`);
    expect(res.ok(), `getBooking(${id}) should succeed`).toBeTruthy();
    return (await res.json()) as Booking;
  }

  async updateBooking(id: number, payload: BookingPayload): Promise<Booking> {
    const res = await this.request.put(`/booking/${id}`, {
      data: payload,
      headers: this.authHeaders(),
    });
    expect(res.ok(), `updateBooking(${id}) should succeed`).toBeTruthy();
    return (await res.json()) as Booking;
  }

  async deleteBooking(id: number): Promise<void> {
    const res = await this.request.delete(`/booking/${id}`, { headers: this.authHeaders() });
    expect(
      [200, 201].includes(res.status()),
      `deleteBooking(${id}) returned ${res.status()}`,
    ).toBeTruthy();
  }

  // restful-booker uses cookie-based auth (Cookie: token=...), not Bearer.
  // This is documented quirk; do not "fix" to bearer.
  private authHeaders(): Record<string, string> {
    if (!this.token) {
      throw new Error('BookerClient is not authenticated. Call authenticate() first.');
    }
    return {
      Cookie: `token=${this.token}`,
      'Content-Type': 'application/json',
    };
  }
}
