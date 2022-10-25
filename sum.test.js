const sum = require('./sum');

test('加法 1 + 2 = 3', () => {
  expect(sum(1, 2)).toBe(3);
});