import { test as base } from '@playwright/test';
import { BookerClient } from '@/api/booker.client';

type ApiFixtures = {
  bookerClient: BookerClient;
};

export const test = base.extend<ApiFixtures>({
  bookerClient: async ({ request }, use) => {
    const client = new BookerClient(request);
    await client.authenticate();
    await use(client);
  },
});
