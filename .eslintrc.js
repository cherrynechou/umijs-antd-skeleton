module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-extra-boolean-cast': 'error',
    '@typescript-eslint/ban-ts-comment': 'off', //允许使用@ts-ignore
    'no-var': 'warn', // 禁止出现var用let和const代替
    'no-use-before-define': [
      'error',
      {
        functions: true,
        classes: true,
        variables: false,
        allowNamedExports: false,
      },
    ],
    quotes: ['warn', 'single', 'avoid-escape'], // 要求统一使用单引号符号
  },
};
