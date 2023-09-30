/** @type {import('jest').Config} */
const config = {
    verbose: true,
    modulePathIgnorePatterns: ["./__tests__/doubles"],
    testEnvironment: 'jest-environment-jsdom-global',
    //testEnvironment: 'node',
    //testEnvironment: 'jsdom',
    setupFilesAfterEnv:['./setupJest.js']
  };
  
  module.exports = config;