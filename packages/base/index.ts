import type {
  Asyncify,
  Except,
  LiteralUnion,
  Primitive,
  Promisable,
  SetOptional,
  SetReadonly,
  SetRequired,
  Simplify,
  Writable,
} from 'type-fest'

export type * from 'type-fest'

export default {}

/**
 * 指定参数和返回类型函数签名
 * @example
 * ```ts
 * // 任意参数、无返回值
 * const fn: Fn = () => 1
 * fn().valueOf() // error
 *
 * // 指定参数和返回值
 * const fn: Fn<[a: number, b: number], number> = (a, b) => a + b
 * fn(1, 2) // number
 *
 * // 指定 this 类型
 * const fn: Fn<[], string, { a: number; b: string }> = function () {
 *   return this.b
 * }
 * fn.call({ a: 1, b: '2' }) // string
 * ```
 */
export type Fn<Args extends any[] = any[], Return = void, ThisArg = any> = (
  this: ThisArg,
  ...args: Args
) => Return

/**
 * 任意参无返回类型函数签名，常用于不关注返回值的函数签名占位
 */
export type NoopFn = Fn

/**
 * 任意参数和返回类型函数签名
 */
export type AnyFn = Fn<any[], any>

/**
 * 异步函数签名
 */
export type PromiseFn<Args extends any[] = any[], Return = unknown, ThisArg = any> = Asyncify<
  Fn<Args, Return, ThisArg>
>

/**
 * 将普通函数转为异步函数
 */
export type ToPromiseFn<T extends AnyFn> = Asyncify<T>

/**
 * 支持异步返回值
 * @example
 * ```ts
 * type Fn = () => Awaitable<number>
 *
 * // 普通返回
 * const fn: Fn = () => 1
 *
 * // 异步返回
 * const fn: Fn = () => Promise.resolve(1)
 * ```
 */
export type Awaitable<T = unknown> = Promisable<Awaited<T>>

/**
 * 支持异步返回值的函数签名
 * @example
 * ```ts
 * // 普通返回
 * const fn: AwaitableFn<[a: string], string> = (a) => a
 *
 * // 异步返回
 * const fn: AwaitableFn<[a: string], string> = (a) => Promise.resolve(a)
 * ```
 */
export type AwaitableFn<Args extends any[] = any[], Return = unknown, ThisArg = any> = Fn<
  Args,
  Awaitable<Return>,
  ThisArg
>

/**
 * 支持通过函数获取值
 * @example
 * ```ts
 * // 普通获取
 * const value: MaybeFn<string, [a: string, b: string]> = '1'
 * value // string
 *
 * // 函数获取
 * const value: MaybeFn<string, [a: string, b: string]> = (a, b) => a + b
 * value('1', '0') // string
 * ```
 */
export type MaybeFn<T, Args extends any[] = []> = T | Fn<Args, T>

/**
 * 转为函数类型
 * @example
 * ```ts
 * // 定义 MaybeFn 实例
 * const value: MaybeFn<string> = 'string'
 * // 转为函数类型
 * const fn: ToFn<typeof value> = () => value
 *
 * // 定义函数实例
 * const value = () => 1
 * // 转为函数类型
 * const fn: ToFn<typeof value> = value
 *
 * // 完善函数类型签名
 * const fn: ToFn<typeof value, [a: number, b: number]> = (a, b) => a + b
 * ```
 */
export type ToFn<T, Args extends any[] = [], ThisArg = any> = T extends AnyFn
  ? T
  : Fn<Args, T, ThisArg>

/**
 * 获取普通值或函数返回值类型
 */
export type ToValue<T> = T extends AnyFn ? ReturnType<T> : T

/**
 * 支持单一或数组值类型
 * @example
 * ```ts
 * // 单一值
 * const one: MaybeArray<number> = 1
 *
 * // 数组值
 * const list: MaybeArray<number> = [1, 2, 3, 4]
 * ```
 */
export type MaybeArray<T> = T | T[]

/**
 * 转为数组类型
 * @example
 * ```ts
 * // 支持单一或数组值类型
 * const list: MaybeArray<number> = [1, 2, 3, 4]
 *
 * // 转为数组类型
 * const array: ToArray<typeof list> = [1, 2, 3, 4]
 * ```
 */
export type ToArray<T> = (T extends MaybeArray<infer R> ? R : T)[]

/**
 * `null` 和 `undefined`
 */
export type Nullish = null | undefined

/**
 * 支持为 `null` 和 `undefined`
 */
export type MaybeNullish<T> = T | Nullish

/**
 * 非 `null` 和 `undefined`
 */
export type NotNullish<T> = [T] extends [MaybeNullish<infer U>] ? U : T

/**
 * 普通对象类型
 * @example
 * ```ts
 * // 任意类型赋值
 * const obj: Recordable = {}
 * // 以下赋值不会报错
 * obj.a = 1
 * obj.b = 2
 *
 * // 指定类型赋值
 * const obj: Recordable<number> = {}
 * obj.a = 1 // 不会报错
 * obj.b = '2' // 静态检查报错
 * ```
 */
export type Recordable<T = unknown, K extends PropertyKey = PropertyKey> = Record<K, T>

/**
 * 获取元素类型，支持数组和对象
 * @example
 * ```ts
 * const arr: number[] = []
 * const obj: { [K: string]: string } = { a: 'a' }
 *
 * type ArrayItem = ElementOf<typeof arr> // number
 * type ObjectItem = ElementOf<typeof obj> // string
 * ```
 */
export type ElementOf<T, Fallback = never> = T extends unknown[]
  ? ArrayElementOf<T, Fallback>
  : ObjectElementOf<T, Fallback>

/**
 * 获取集合元素类型
 * @example
 * ```ts
 * const arr: number[] = []
 * const item: ArrayElementOf<typeof arr> = 1 // number
 * ```
 */
export type ArrayElementOf<T, Fallback = never> = T extends Array<infer E> ? E : Fallback

/**
 * 获取对象元素类型
 * @example
 * ```ts
 * const obj: Recordable<string> = { a: 'a' }
 * const item: ObjectElementOf<typeof obj> = 'b' // string
 * ```
 */
export type ObjectElementOf<T, Fallback = never> = T extends Recordable<infer E, PropertyKey>
  ? E
  : Fallback

/**
 * 除过指定属性，其他属性转为可选
 * @example
 * ```ts
 * interface A {
 *   a: string;
 *   b: number;
 * }
 *
 * type _A = PartialWithout<A, 'a'>
 * // => { a: string; b?: number }
 * ```
 */
export type PartialWithout<T, K extends keyof T> = Simplify<Pick<T, K> & Partial<Omit<T, K>>>

/**
 * 除过指定属性，其他属性转为必填
 * @example
 * ```ts
 * interface A {
 *   a?: string;
 *   b?: number;
 * }
 *
 * type _A = RequiredWithout<A, 'a'>
 * // => { a?: string; b: number }
 * ```
 */
export type RequiredWithout<T, K extends keyof T> = Simplify<Pick<T, K> & Required<Omit<T, K>>>

/**
 * 除过指定属性，其他属性转为只读
 * @example
 * ```ts
 * interface A {
 *   a: string;
 *   b: number;
 * }
 *
 * type _A = ReadonlyWithout<A, 'a'>
 * // => { a: string; readonly b: number }
 * ```
 */
export type ReadonlyWithout<T, K extends keyof T> = Simplify<Pick<T, K> & Readonly<Omit<T, K>>>

/**
 * 除过指定属性，其他属性转为可写
 * @example
 * ```ts
 * interface A {
 *   readonly a: string;
 *   readonly b: number;
 * }
 *
 * type _A = WritableWithout<A, 'a'>
 * // => { readonly a: string; b: number }
 * ```
 */
export type WritableWithout<T, K extends keyof T> = Simplify<Pick<T, K> & Writable<Omit<T, K>>>

/**
 * 指定属性转为可选
 * @example
 * ```ts
 * interface A {
 *   a: string;
 *   b: number;
 * }
 *
 * type _A = PartialWith<A, 'a'>
 * // => { a?: string; b: number }
 * ```
 */
export type PartialWith<T, K extends keyof T> = SetOptional<T, K>

/**
 * 指定属性转为必填
 * @example
 * ```ts
 * interface A {
 *   a?: string;
 *   b?: number;
 * }
 *
 * type _A = RequiredWith<A, 'a'>
 * // => { a: string; b?: number }
 * ```
 */
export type RequiredWith<T, K extends keyof T> = SetRequired<T, K>

/**
 * 指定属性转为只读
 * @example
 * ```ts
 * interface A {
 *   a: string;
 *   b: number;
 * }
 *
 * type _A = ReadonlyWith<A, 'a'>
 * // => { readonly a: string; b: number }
 * ```
 */
export type ReadonlyWith<T, K extends keyof T> = SetReadonly<T, K>

/**
 * 设置指定可写属性，补齐 `SetXxx` 系列工具函数
 * @example
 * ```ts
 * interface A {
 *   readonly a: string;
 *   readonly b: number;
 * }
 *
 * type _A = SetWritable<A, 'a'>
 * // => { a: string; readonly b: number }
 * ```
 */
export type SetWritable<BaseType, Keys extends keyof BaseType> = Simplify<
  Except<BaseType, Keys> & Writable<Pick<BaseType, Keys>>
>

/**
 * 指定属性转为可写
 * @example
 * ```ts
 * interface A {
 *   readonly a: string;
 *   readonly b: number;
 * }
 *
 * type _A = WritableWith<A, 'a'>
 * // => { a: string; readonly b: number }
 * ```
 */
export type WritableWith<T, K extends keyof T> = SetWritable<T, K>

/**
 * 是否为 `null`、`undefined`
 * @example
 * ```ts
 * type A = IfNullish<undefined, 'A', 'B'> // 'A'
 * ```
 */
export type IfNullish<T, V = true, F = false> = [T] extends [Nullish] ? V : F

/**
 * 是否为 `null`、`undefined`、`''`
 * @example
 * ```ts
 * type A = IfEmpty<'', 'A', 'B'> // 'A'
 * ```
 */
export type IfEmpty<T, V = true, F = false> = [T] extends ['' | Nullish] ? V : F

/**
 * 宽松版 `keyof`
 * @example
 * ```ts
 * type Key = KeyOf<{ a: string; b: number; }>
 * // => 'a' | 'b' | (PropertyKey & {})
 *
 * const key: Key = 'a' // 智能提示
 * const key2: Key = 1 // 不会报错
 * ```
 */
export type KeyOf<T, BaseType extends Primitive = PropertyKey> = T extends Primitive
  ? BaseType
  : LiteralUnion<keyof T, BaseType>

/**
 * 设置子级列表
 * @example
 * ```ts
 * interface Model {
 *   a: string;
 *   b: number;
 * }
 *
 * type TreeModel = WithChildren<Model, 'children', false>
 * ```
 */
export type WithChildren<
  T,
  ChildrenKey extends string = 'children',
  Required extends boolean = false,
> = Simplify<
  T &
    PartialWith<
      Record<ChildrenKey, WithChildren<T, ChildrenKey, Required>[]>,
      Required extends true ? never : ChildrenKey
    >
>
