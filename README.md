# PWAStudio `.targetables.js` Plugins

Allows to use `.targetables.js` for PWAStudio


### Usage Exsample

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
| `targetablesSearchPaths` | `string`[] |
| `fileExtendsion` | `string` | `'*.css'` |
| `magentoPath` | `string` | `'node_modules/@magento'` |

#### Returns

`void`

#### Defined in

index.ts:69

___

### allowCustomTargetables

▸ **allowCustomTargetables**(`targetablesSearchPaths?`, `fileExtendsion?`, `magentoPath?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `targetablesSearchPaths` | `string`[] |
| `fileExtendsion` | `string` | `'*.targetables.js'` |
| `magentoPath` | `string` | `'node_modules/@magento'` |

#### Returns

`void`

#### Defined in

index.ts:22
