/** @type {import('stylelint').Config} */
export default {
  extends: [
      'stylelint-config-recommended-vue/scss',
      'stylelint-config-standard-vue',
      'stylelint-config-recess-order',
  ],
  rules: {
      'block-no-empty': true,
      "selector-class-pattern": null,  // kebab-caseを要求してくるが、BEM記法を使っているので無効化
  },
}
