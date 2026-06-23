module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|jest-)?react-native|@react-native|@react-navigation|expo|expo-.*|@expo|react-native-vector-icons|@react-native-async-storage|react-native-safe-area-context|react-native-screens|react-native-web)',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
};
