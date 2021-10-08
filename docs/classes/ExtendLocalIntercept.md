[@larsroettig/component-targetables](../README.md) / [Exports](../modules.md) / ExtendLocalIntercept

# Class: ExtendLocalIntercept

## Table of contents

### Constructors

- [constructor](ExtendLocalIntercept.md#constructor)

### Properties

- [componentsCache](ExtendLocalIntercept.md#componentscache)
- [targetables](ExtendLocalIntercept.md#targetables)

### Methods

- [allowCssOverwrites](ExtendLocalIntercept.md#allowcssoverwrites)
- [allowCustomTargetables](ExtendLocalIntercept.md#allowcustomtargetables)
- [getPathsByFileExtendsion](ExtendLocalIntercept.md#getpathsbyfileextendsion)
- [getReactComponent](ExtendLocalIntercept.md#getreactcomponent)

## Constructors

### constructor

• **new ExtendLocalIntercept**(`targetables`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetables` | `any` |

#### Defined in

[index.ts:10](https://github.com/larsroettig/component-targetables/blob/a102960/lib/index.ts#L10)

## Properties

### componentsCache

• `Private` **componentsCache**: `Record`<`string`, `any`\> = `{}`

#### Defined in

[index.ts:8](https://github.com/larsroettig/component-targetables/blob/a102960/lib/index.ts#L8)

___

### targetables

• `Private` **targetables**: `any`

#### Defined in

[index.ts:6](https://github.com/larsroettig/component-targetables/blob/a102960/lib/index.ts#L6)

## Methods

### allowCssOverwrites

▸ **allowCssOverwrites**(`fileExtendsion?`, `magentoPath?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `fileExtendsion` | `string` | `'*.css'` |
| `magentoPath` | `string` | `'node_modules/@magento'` |

#### Returns

`void`

#### Defined in

[index.ts:58](https://github.com/larsroettig/component-targetables/blob/a102960/lib/index.ts#L58)

___

### allowCustomTargetables

▸ **allowCustomTargetables**(`fileExtendsion?`, `magentoPath?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `fileExtendsion` | `string` | `'*.targetables.js'` |
| `magentoPath` | `string` | `'node_modules/@magento'` |

#### Returns

`void`

#### Defined in

[index.ts:18](https://github.com/larsroettig/component-targetables/blob/a102960/lib/index.ts#L18)

___

### getPathsByFileExtendsion

▸ `Private` **getPathsByFileExtendsion**(`fileExtendsion`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileExtendsion` | `string` |

#### Returns

`string`[]

#### Defined in

[index.ts:115](https://github.com/larsroettig/component-targetables/blob/a102960/lib/index.ts#L115)

___

### getReactComponent

▸ `Private` **getReactComponent**(`modulePath`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `modulePath` | `string` |

#### Returns

`any`

#### Defined in

[index.ts:104](https://github.com/larsroettig/component-targetables/blob/a102960/lib/index.ts#L104)
