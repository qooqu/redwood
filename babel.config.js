const packageJSON = require('./package.json')

const TARGETS_NODE = '12.16'
const TARGETS_BROWSERS = ['defaults', 'not IE 11', 'not IE_Mob 11']
// Warning! Recommended to specify used minor core-js version, like corejs: '3.6',
// instead of corejs: '3', since with '3' it will not be injected modules
// which were added in minor core-js releases.
// https://github.com/zloirock/core-js/blob/master/README.md#babelpreset-env
const CORE_JS_VERSION = '3.10'

// We use the recommended babel configuration for monorepos, which is a base directory
// `babel.config.js` file, but then use a per-project `.babelrc.js` file.
// Learn more: https://babeljs.io/docs/en/config-files#monorepos
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: TARGETS_NODE },
        useBuiltIns: 'usage',
        corejs: {
          version: CORE_JS_VERSION,
          // List of supported proposals: https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#ecmascript-proposals
          proposals: true,
        },
      },
    ],
    '@babel/preset-react',
    '@babel/typescript',
  ],
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          src: './src',
        },
      },
    ],
    /**
     * NOTE
     * Experimental decorators are used in `@redwoodjs/structure`.
     * https://github.com/tc39/proposal-decorators
     **/
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        // https://babeljs.io/docs/en/babel-plugin-transform-runtime/#core-js-aliasing
        // Setting the version here also requires `@babel/runtime-corejs3`
        corejs: { version: 3, proposals: true },
        // https://babeljs.io/docs/en/babel-plugin-transform-runtime/#version
        // Transform-runtime assumes that @babel/runtime@7.0.0 is installed.
        // Specifying the version can result in a smaller bundle size.
        version: packageJSON.devDependencies['@babel/runtime-corejs3'],
      },
    ],
  ],
  overrides: [
    // ** WEB PACKAGES **
    {
      test: [
        './packages/router',
        './packages/web/',
        './packages/auth/',
        './packages/forms/',
      ],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: TARGETS_BROWSERS,
            },
          },
        ],
      ],
      plugins: [
        [
          'babel-plugin-auto-import',
          {
            declarations: [
              {
                // import { React } from 'react'
                default: 'React',
                path: 'react',
              },
              {
                // import { PropTypes } from 'prop-types'
                default: 'PropTypes',
                path: 'prop-types',
              },
            ],
          },
        ],
      ],
    },
  ],
  // Ignore test directories when we're not testing
  ignore:
    process.env.NODE_ENV === 'test'
      ? []
      : [/\.test\.(js|ts)/, '**/__tests__', '**/__mocks__', '**/__snapshots__'],
}
