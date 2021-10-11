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
- [buildRegex](ExtendLocalIntercept.md#buildregex)
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

index.ts:13

## Properties

### componentsCache

• `Private` **componentsCache**: `Record`<`string`, `any`\> = `{}`

#### Defined in

index.ts:11

___

### targetables

• `Private` **targetables**: `any`

#### Defined in

index.ts:9

## Methods

### allowCssOverwrites

▸ **allowCssOverwrites**(`targetablesSearchPaths?`, `fileExtendsion?`, `magentoPath?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `targetablesSearchPaths` | `string`[] | `undefined` |
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
| `targetablesSearchPaths` | `string`[] | `undefined` |
| `fileExtendsion` | `string` | `'*.targetables.js'` |
| `magentoPath` | `string` | `'node_modules/@magento'` |

#### Returns

`void`

#### Defined in

index.ts:22

___

### buildRegex

▸ `Private` **buildRegex**(`targetablesSearchPaths`): `RegExp`

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetablesSearchPaths` | `string`[] |

#### Returns

`RegExp`

#### Defined in

index.ts:119

___

### getPathsByFileExtendsion

▸ `Private` **getPathsByFileExtendsion**(`fileExtendsion`, `targetablesSearchPaths?`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileExtendsion` | `string` |
| `targetablesSearchPaths` | `string`[] |

#### Returns

`string`[]

#### Defined in

index.ts:146

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

index.ts:135
