/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  coverageProvider: "v8",

  moduleFileExtensions: [
    "js",
  //   "mjs",
  //   "cjs",
  //   "jsx",
    "ts",
  //   "mts",
  //   "cts",
  //   "tsx",
  //   "json",
  //   "node"
  ],
  
  // The test environment that will be used for testing
  testEnvironment: "node",
  
  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
};

module.exports = config;
