/**
 * @file Pug-lint configuration.
 */

module.exports = {
  disallowAttributeConcatenation: true,
  disallowAttributeInterpolation: null,
  disallowAttributeTemplateString: null,
  disallowBlockExpansion: null,
  disallowClassAttributeWithStaticValue: true,
  disallowClassLiteralsBeforeIdLiterals: true,
  disallowDuplicateAttributes: true,
  disallowIdAttributeWithStaticValue: true,
  disallowLegacyMixinCall: true,
  disallowMultipleLineBreaks: true,
  disallowSpacesInsideAttributeBrackets: true,
  disallowSpecificAttributes: [
    {'a': 'name'}
  ],
  disallowSpecificTags: null,
  disallowStringConcatenation: true,
  disallowStringInterpolation: null,
  disallowTagInterpolation: null,
  disallowTemplateString: null,
  requireClassLiteralsBeforeAttributes: true,
  requireIdLiteralsBeforeAttributes: true,
  requireLineFeedAtFileEnd: true,
  requireLowerCaseAttributes: true,
  requireLowerCaseTags: true,
  requireSpaceAfterCodeOperator: true,
  requireSpecificAttributes: null,
  requireStrictEqualityOperators: true,
  validateAttributeQuoteMarks: '\'',
  validateAttributeSeparator: {
    separator: ', ',
    multiLineSeparator: '\n '
  },
  validateDivTags: true,
  validateIndentation: 2,
  validateLineBreaks: 'LF',
  validateSelfClosingTags: true,
  validateTemplateString: null
}
