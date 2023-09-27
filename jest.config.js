/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testEnvironment: 'jest-environment-jsdom-global',
    setupFilesAfterEnv:['./setupJest.js']
  };
  
  module.exports = config;