/**
 * Babel config used only by Jest (via babel-jest) for transforming test
 * files and instrumenting source files for coverage.
 *
 * `sourceType: 'unambiguous'` lets Babel treat scripts without import/export
 * (such as js/main.js, a browser script) as classic scripts rather than ES
 * modules, which is required to instrument them for coverage.
 */
module.exports = {
    sourceType: 'unambiguous'
};
