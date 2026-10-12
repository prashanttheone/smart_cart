/* eslint-env jest */
require('react-native-gesture-handler/jestSetup');

try {
  const { JSReanimated } = require('react-native-reanimated/src/ReanimatedModule/js-reanimated/JSReanimated');
  JSReanimated.prototype.setCSSEventHandler = () => {};
} catch {}

jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
