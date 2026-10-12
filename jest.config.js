module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '^lucide-react-native$': '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-redux|@reduxjs|immer|@tanstack|lucide-react-native|react-native-element-dropdown|react-native-drawer-layout|react-native-worklets|react-native-gesture-handler|react-native-reanimated|react-native-screens|react-native-safe-area-context|@react-native-community)/)',
  ],
};
