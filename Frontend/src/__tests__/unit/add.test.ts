/**
 * @jest-environment node
 */

// This file was created only for showcase purposes. Delete it after the project is setup.

import add from '../../helpers/add';

// Test case 1: Adding two positive numbers
test('Adding 2 and 3 should return 5', () => {
  const result = add(2, 3);
  expect(result).toBe(5);
});

// Test case 2: Adding a positive and a negative number
test('Adding 5 and -3 should return 2', () => {
  const result = add(5, -3);
  expect(result).toBe(2);
});

// Test case 3: Adding two negative numbers
test('Adding -2 and -3 should return -5', () => {
  const result = add(-2, -3);
  expect(result).toBe(-5);
});
