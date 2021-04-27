module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'vuetify/lib(.*)': '<rootDir>/node_modules/vuetify/es5$1',
  },
  modulePaths: ['<rootDir>/src', '<rootDir>/node_modules'],
  transform: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.ts?$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(vuetify)/)'],
  setupFiles: ['jest-canvas-mock'],
}
