import { faker } from '@faker-js/faker';
import type { CheckoutInfo, BookingPayload } from '@/types';

export const buildCheckoutInfo = (overrides: Partial<CheckoutInfo> = {}): CheckoutInfo => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  zipCode: faker.location.zipCode(),
  ...overrides,
});

export const buildBookingPayload = (overrides: Partial<BookingPayload> = {}): BookingPayload => ({
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  totalprice: faker.number.int({ min: 50, max: 500 }),
  depositpaid: true,
  bookingdates: {
    checkin: '2026-05-01',
    checkout: '2026-05-07',
  },
  additionalneeds: 'Breakfast',
  ...overrides,
});
