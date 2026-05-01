import type { User } from '@/types';

// Saucedemo's published demo users — credentials are public and listed on the site itself.
export const standardUser: User = {
  username: 'standard_user',
  password: 'secret_sauce',
};

export const lockedOutUser: User = {
  username: 'locked_out_user',
  password: 'secret_sauce',
};

export const problemUser: User = {
  username: 'problem_user',
  password: 'secret_sauce',
};

export const performanceUser: User = {
  username: 'performance_glitch_user',
  password: 'secret_sauce',
};
