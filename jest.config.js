// file: jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // <= setup file here
  testEnvironment: "jest-environment-jsdom",
  modulePathIgnorePatterns: ["<rootDir>/tests/", "<rootDir>/tests-examples/"],
};

module.exports = createJestConfig(customJestConfig);
