/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "jest",
  coverageAnalysis: "off",
  mutate: ['src/**/*.ts', '!**/*.test.ts', '!**/config.ts'],
  thresholds: {
    break: 100
  }
};
