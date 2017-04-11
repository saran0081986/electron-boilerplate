/**
 * @file ESLint configuration.
 */

module.exports = {
  root: true,
  extends: 'standard',
  globals: {
    // Mocha globals.
    describe: true,
    context: true,
    it: true,
    specify: true,
    before: true,
    after: true,
    beforeEach: true,
    afterEach: true,
    suite: true,
    test: true,
    suiteSetup: true,
    suiteTeardown: true,
    setup: true,
    teardown: true
  }
}
