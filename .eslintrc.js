module.exports = {
  root: true,
  extends: ['airbnb-base','airbnb-typescript/base'],
  rules: {
    'class-methods-use-this': 'off',
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
