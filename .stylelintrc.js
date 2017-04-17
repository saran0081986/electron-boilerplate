/**
 * @file StyleLint configuration.
 */

module.exports = {
  extends: 'stylelint-config-standard',
  plugins: [
    'stylelint-scss',
    'stylelint-order'
  ],
  rules: {
    'order/order': [
      'declarations',
      'rules'
    ],
    'order/properties-order': [
      [
        {
          emptyLineBefore: 'never',
          properties: [
            'position',
            'top',
            'right',
            'bottom',
            'left'
          ]
        },
        {
          emptyLineBefore: 'always',
          properties: [
            'display',
            'width',
            'height',
            'margin',
            'padding',
            'border'
          ]
        }
      ],
      {
        unspecified: 'bottomAlphabetical'
      }
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        except: [
          'blockless-after-same-name-blockless',
          'first-nested'
        ],
        ignore: [
          'after-comment'
        ],
        ignoreAtRules: [
          'else'
        ]
      }
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'import',
          'media',
          'extend',
          'at-root',
          'debug',
          'warn',
          'error',
          'if',
          'for',
          'each',
          'while',
          'mixin',
          'include'
        ]
      }
    ],
    'at-rule-no-vendor-prefix': true,
    'block-closing-brace-newline-after': [
      'always-multi-line',
      {
        ignoreAtRules: [
          'if',
          'else'
        ]
      }
    ],
    'color-named': 'never',
    'declaration-colon-space-after': null,
    'declaration-no-important': true,
    'font-family-name-quotes': 'always-unless-keyword',
    'function-url-no-scheme-relative': true,
    'function-url-quotes': 'always',
    'max-line-length': 120,
    'max-nesting-depth': 4,
    'media-feature-name-no-vendor-prefix': true,
    'number-leading-zero': 'never',
    'property-no-vendor-prefix': true,
    'selector-attribute-quotes': 'always',
    'selector-class-pattern': [
      '^(_)?[a-z]+-[a-z0-9-]+((__|--)?[a-z0-9-]+)?(--[a-z0-9-]+)?[a-z0-9]$',
      {
        resolveNestedSelectors: true
      }
    ],
    'selector-id-pattern': '^[a-z][-a-z0-9]*$',
    'selector-max-compound-selectors': 3,
    'selector-nested-pattern': '^&((__|--|::)?[a-z0-9-]+)?((--|::)[a-z0-9-]+)?[a-z0-9]$',
    'selector-no-attribute': true,
    'selector-no-id': true,
    'selector-no-vendor-prefix': true,
    'string-quotes': 'single',
    'value-no-vendor-prefix': true,
    'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
    'scss/at-else-closing-brace-space-after': 'always-intermediate',
    'scss/at-else-empty-line-before': 'never',
    'scss/at-import-no-partial-leading-underscore': true,
    'scss/at-import-partial-extension-blacklist': [
      'scss'
    ],
    'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
    'scss/at-if-closing-brace-space-after': 'always-intermediate',
    'scss/at-function-pattern': '^[a-z][-a-z0-9]*$',
    'scss/at-mixin-argumentless-call-parentheses': 'never',
    'scss/at-mixin-pattern': '^[a-z][-a-z0-9]*$',
    'scss/declaration-nested-properties-no-divided-groups': true,
    'scss/dollar-variable-pattern': '^[a-z][-a-z0-9]*$',
    'scss/operator-no-unspaced': true,
    'scss/percent-placeholder-pattern': '^[a-z][-a-z0-9]*$',
    'scss/selector-no-redundant-nesting-selector': true
  }
}
