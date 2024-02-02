# `@rhao/types-base`

`Typescript` 常用的类型工具。

## 迁移至 v1.x

- 移除 `Builtin` 类型
- 移除 `Getter`、`MaybeGetter` 类型，推荐使用 `Fn`、`MaybeFn` 替代
- `DeepReadonly` => `ReadonlyDeep`
- `DeepPartial` => `PartialDeep`
- `ElementOf` 支持数组、对象获取元素类型，单一获取推荐 `ArrayElementOf`、`ObjectElementOf`
- `RecordElementOf` => `ObjectElementOf`
- `Mutable` => `Writable`、`MutableWith` => `WritableWith`、`MutableWithout` => `WritableWithout`
- `IfUnknown`、`IfNever`、`IfEmpty` 默认成功和失败值改为 `true` 和 `false`
- `KeyOf` 默认不再限于 `string`
- 移除 `PromiseResult` 类型，推荐使用 `Awaited` 替代
