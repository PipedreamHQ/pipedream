# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.9.0](https://github.com/appcelerator/docs-devkit/compare/v4.8.3...v4.9.0) (2020-11-10)


### Bug Fixes

* fix color shades, sidebar sub groups and type meta padding ([ffc5817](https://github.com/appcelerator/docs-devkit/commit/ffc581761be5331d94bd6d222c24b044925b11a8))


### Features

* **theme:** custom color theme for prism.js ([#83](https://github.com/appcelerator/docs-devkit/issues/83)) ([c826dc0](https://github.com/appcelerator/docs-devkit/commit/c826dc0d34e6f2c149109490800a752b0d39aef0))





## [4.8.3](https://github.com/appcelerator/docs-devkit/compare/v4.8.2...v4.8.3) (2020-10-21)


### Bug Fixes

* use axway theme gray-dk in place of hard-coded #aaa ([7723256](https://github.com/appcelerator/docs-devkit/commit/7723256))
* use named axway colors in place of hard-coded hex values ([961cbb1](https://github.com/appcelerator/docs-devkit/commit/961cbb1))





## [4.8.2](https://github.com/appcelerator/docs-devkit/compare/v4.8.1...v4.8.2) (2020-10-19)


### Bug Fixes

* scroll behavior and css adjustments ([c8cb639](https://github.com/appcelerator/docs-devkit/commit/c8cb639))
* **theme:** add axway color variables ([df8c5b3](https://github.com/appcelerator/docs-devkit/commit/df8c5b3))
* **theme:** try to use axway typography values for headers ([7fd1115](https://github.com/appcelerator/docs-devkit/commit/7fd1115))
* **theme:** use axway blue colors for inline code tags ([16bb3e5](https://github.com/appcelerator/docs-devkit/commit/16bb3e5))
* **theme:** use axway danger/success/warn colors for badges ([a543d9c](https://github.com/appcelerator/docs-devkit/commit/a543d9c))
* **theme:** use axway danger/success/warn colors for custom blocks ([4a9cfe1](https://github.com/appcelerator/docs-devkit/commit/4a9cfe1))
* **theme:** use page relativePath to generate edit link ([#70](https://github.com/appcelerator/docs-devkit/issues/70)) ([ca0e1c2](https://github.com/appcelerator/docs-devkit/commit/ca0e1c2)), closes [#48](https://github.com/appcelerator/docs-devkit/issues/48)





# [4.8.0](https://github.com/appcelerator/docs-devkit/compare/v4.7.0...v4.8.0) (2020-10-08)


### Features

* **theme-titanium:** allow frontmatter to contain editUrl for edit this page link ([dd6a1e2](https://github.com/appcelerator/docs-devkit/commit/dd6a1e2))





## [4.5.1](https://github.com/appcelerator/docs-devkit/compare/v4.5.0...v4.5.1) (2020-06-19)


### Performance Improvements

* cache page lookup ([4c27c0f](https://github.com/appcelerator/docs-devkit/commit/4c27c0f))





# [4.5.0](https://github.com/appcelerator/docs-devkit/compare/v4.4.1...v4.5.0) (2020-06-18)


### Bug Fixes

* mark all nested sidebar items active ([fcc5312](https://github.com/appcelerator/docs-devkit/commit/fcc5312))
* nested sidebars without path ([62bacb1](https://github.com/appcelerator/docs-devkit/commit/62bacb1))
* pass reactive data to ensure child component updates ([1776df0](https://github.com/appcelerator/docs-devkit/commit/1776df0))
* sidebar css fixes ([396ac84](https://github.com/appcelerator/docs-devkit/commit/396ac84))


### Features

* support nested sidebars ([1e28793](https://github.com/appcelerator/docs-devkit/commit/1e28793))





## [4.0.1](https://github.com/appcelerator/docs-devkit/compare/v4.0.0...v4.0.1) (2019-12-11)

**Note:** Version bump only for package vuepress-theme-titanium





# 4.0.0 (2019-12-02) [YANKED]

# 3.0.0 (2019-12-02) [YANKED]

# 2.0.0 (2019-12-02) [YANKED]

# 1.0.0 (2019-12-02)


### Bug Fixes

* **theme:** show footer only if configured ([9d9f4d2](https://github.com/appcelerator/docs-devkit/commit/9d9f4d2))
* add default theme color palette ([31d20e6](https://github.com/appcelerator/docs-devkit/commit/31d20e6))
* **theme:** add bottom padding to home page ([6b2d0be](https://github.com/appcelerator/docs-devkit/commit/6b2d0be))
* **theme:** add default content class ([d516092](https://github.com/appcelerator/docs-devkit/commit/d516092))
* **theme:** apply latest theme-default ([7b15292](https://github.com/appcelerator/docs-devkit/commit/7b15292))
* **theme:** guard against undefined paths ([ed03520](https://github.com/appcelerator/docs-devkit/commit/ed03520))
* **theme:** height wrapper to avoid glitches ([7923ded](https://github.com/appcelerator/docs-devkit/commit/7923ded))
* **theme:** mark versions dropdown as can-hide ([eecb704](https://github.com/appcelerator/docs-devkit/commit/eecb704))
* **theme:** only show api sidebar button if page has api docs ([06513cb](https://github.com/appcelerator/docs-devkit/commit/06513cb))
* **theme:** show version dropdown on versioned pages only ([ab18f4d](https://github.com/appcelerator/docs-devkit/commit/ab18f4d))
* **theme:** test for available headers before accessing ([91bb50d](https://github.com/appcelerator/docs-devkit/commit/91bb50d))
* respect locale in version dropdown ([3e80fe9](https://github.com/appcelerator/docs-devkit/commit/3e80fe9))
* use versioned links in navbar ([9a45f85](https://github.com/appcelerator/docs-devkit/commit/9a45f85))
* **theme:** use correct edit link for pages ([953b39e](https://github.com/appcelerator/docs-devkit/commit/953b39e))
* **versioning:** more safeguards in case no versions were created yet ([0615344](https://github.com/appcelerator/docs-devkit/commit/0615344))
* **versioning:** properly generate versioned edit links ([1be0e45](https://github.com/appcelerator/docs-devkit/commit/1be0e45))


### Features

* custom next version label ([85d0746](https://github.com/appcelerator/docs-devkit/commit/85d0746))
* make footer configurable ([27e4e14](https://github.com/appcelerator/docs-devkit/commit/27e4e14))
* update to VuePress 1.0.2 ([74d7ca8](https://github.com/appcelerator/docs-devkit/commit/74d7ca8))
* **theme:** update code color ([15f81f8](https://github.com/appcelerator/docs-devkit/commit/15f81f8))
* **versioning:** search through current version only ([ce69184](https://github.com/appcelerator/docs-devkit/commit/ce69184))





# [0.2.0](https://github.com/appcelerator/docs-devkit/compare/v0.1.5...v0.2.0) (2019-09-09)

**Note:** Version bump only for package vuepress-theme-titanium





## [0.1.2](https://github.com/appcelerator/docs-devkit/compare/v0.1.1...v0.1.2) (2019-07-27)


### Bug Fixes

* **theme:** test for available headers before accessing ([91bb50d](https://github.com/appcelerator/docs-devkit/commit/91bb50d))





# 0.1.0 (2019-07-27)


### Bug Fixes

* **theme:** show footer only if configured ([9d9f4d2](https://github.com/appcelerator/docs-devkit/commit/9d9f4d2))
* add default theme color palette ([31d20e6](https://github.com/appcelerator/docs-devkit/commit/31d20e6))
* **theme:** add bottom padding to home page ([6b2d0be](https://github.com/appcelerator/docs-devkit/commit/6b2d0be))
* **theme:** add default content class ([d516092](https://github.com/appcelerator/docs-devkit/commit/d516092))
* **theme:** apply latest theme-default ([7b15292](https://github.com/appcelerator/docs-devkit/commit/7b15292))
* **theme:** guard against undefined paths ([ed03520](https://github.com/appcelerator/docs-devkit/commit/ed03520))
* **theme:** height wrapper to avoid glitches ([7923ded](https://github.com/appcelerator/docs-devkit/commit/7923ded))
* **theme:** mark versions dropdown as can-hide ([eecb704](https://github.com/appcelerator/docs-devkit/commit/eecb704))
* **theme:** only show api sidebar button if page has api docs ([06513cb](https://github.com/appcelerator/docs-devkit/commit/06513cb))
* **theme:** show version dropdown on versioned pages only ([ab18f4d](https://github.com/appcelerator/docs-devkit/commit/ab18f4d))
* respect locale in version dropdown ([3e80fe9](https://github.com/appcelerator/docs-devkit/commit/3e80fe9))
* use versioned links in navbar ([9a45f85](https://github.com/appcelerator/docs-devkit/commit/9a45f85))
* **theme:** use correct edit link for pages ([953b39e](https://github.com/appcelerator/docs-devkit/commit/953b39e))
* **versioning:** more safeguards in case no versions were created yet ([0615344](https://github.com/appcelerator/docs-devkit/commit/0615344))
* **versioning:** properly generate versioned edit links ([1be0e45](https://github.com/appcelerator/docs-devkit/commit/1be0e45))


### Features

* custom next version label ([85d0746](https://github.com/appcelerator/docs-devkit/commit/85d0746))
* make footer configurable ([27e4e14](https://github.com/appcelerator/docs-devkit/commit/27e4e14))
* update to VuePress 1.0.2 ([74d7ca8](https://github.com/appcelerator/docs-devkit/commit/74d7ca8))
* **theme:** update code color ([15f81f8](https://github.com/appcelerator/docs-devkit/commit/15f81f8))
* **versioning:** search through current version only ([ce69184](https://github.com/appcelerator/docs-devkit/commit/ce69184))
