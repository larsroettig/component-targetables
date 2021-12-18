# PWAStudio `.targetables.js` Plugins

[![Coverage Status](https://coveralls.io/repos/github/larsroettig/component-targetables/badge.svg?branch=main)](https://coveralls.io/github/larsroettig/component-targetables?branch=main)

Allows to use `.targetables.js` for PWAStudio

## Usage Exsample

```javascript
const { ExtendLocalIntercept } = require('@larsroettig/component-targetables');

function localIntercept(targets) {
    const { Targetables } = require('@magento/pwa-buildpack');
    const targetables = Targetables.using(targets);

    const extendLocalIntercept = new ExtendLocalIntercept(targetables);
    extendLocalIntercept.allowCustomTargetables();
    extendLocalIntercept.allowCssOverwrites();
}

module.exports = localIntercept;
```

*Big shoutout to Chris Brabender for this blog post*
https://dev.to/chrisbrabender/simplifying-targetables-in-pwa-studio-p8b

## Api Documentation
### allowCssOverwrites

▸ **allowCssOverwrites**(`targetablesSearchPaths?`, `fileExtendsion?`, `magentoPath?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `fileExtendsion` | `string` | `'*.module.css'` |
| `targetablesSearchPaths` | `string[]`| `['src/components', 'src/RootComponents']` |
| `magentoPath` | `string` | `'node_modules/@magento'` |

#### Returns

`void`

___

### allowCustomTargetables

▸ **allowCustomTargetables**(`targetablesSearchPaths?`, `fileExtendsion?`, `magentoPath?`): `void`

Allows to place a custome targetable with given matching filepattern.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `fileExtendsion` | `string` | `'*.targetables.js'` |
| `targetablesSearchPaths` | `string[]`| `['src/components', 'src/RootComponents']` |
| `magentoPath` | `string` | `'node_modules/@magento'` |

#### Returns

`void`

### Demo
https://github.com/larsroettig/demo-component-targetables
