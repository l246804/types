export default {}

/**
 * 原始值类型
 */
export type Primitive = string | number | boolean | bigint | symbol | undefined | null

/**
 * 内置值类型
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type Builtin = Primitive | Function | Date | Error | RegExp

/**
 * 指定参数和返回类型函数签名
 */
export type Fn<Args extends any[] = any[], Return = void> = (...args: Args) => Return

/**
 * 无参无返回类型函数签名
 */
export type NoopFn = Fn<[]>

/**
 * 任意参数和返回类型函数签名
 */
export type AnyFn = Fn<any[], any>

/**
 * 异步函数签名
 */
export type PromiseFn<Args extends any[] = any[], Return = void> = Fn<Args, Promise<Return>>

/**
 * 异步化函数类型工具
 */
export type ToPromiseFn<T extends AnyFn> = PromiseFn<Parameters<T>, ReturnType<T>>

/**
 * 可异步值类型
 */
export type Awaitable<T> = T | Promise<T>

/**
 * 可异步函数签名
 */
export type AwaitableFn<Args extends any[] = any[], Return = void> = Fn<Args, Awaitable<Return>>

/**
 * 特殊函数签名，仅读取值
 */
export type Getter<T> = Fn<[], T>

export type MaybeGetter<T> = T | Getter<T>

export type MaybeFn<T, Args extends any[] = []> = T | Fn<Args, T>

/**
 * MaybeFn 转为函数类型
 */
export type ToFn<T, Args extends any[] = []> = T extends AnyFn ? T : Fn<Args, T>

/**
 * MaybeFn、MaybeGetter 转为值类型
 */
export type ToValue<T> = T extends AnyFn ? ReturnType<T> : T

export type MaybeArray<T> = T | T[]

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

export type Recordable<T = any, K extends string | number | symbol = string> = Record<K, T>

export interface PlainObject<T = any> {
  [key: string]: T
}

export type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

export type DeepReadonly<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends Set<infer U>
  ? ReadonlySet<DeepReadonly<U>>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<DeepReadonly<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<DeepReadonly<U>>
  : T extends Promise<infer U>
  ? Promise<DeepReadonly<U>>
  : // eslint-disable-next-line @typescript-eslint/ban-types
  T extends {}
  ? {
      readonly [K in keyof T]: DeepReadonly<T[K]>
    }
  : Readonly<T>

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<DeepPartial<K>, DeepPartial<V>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<DeepPartial<K>, DeepPartial<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<DeepPartial<K>, DeepPartial<V>>
  : T extends Set<infer U>
  ? ReadonlySet<DeepPartial<U>>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<DeepPartial<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<DeepPartial<U>>
  : T extends Promise<infer U>
  ? Promise<DeepPartial<U>>
  : // eslint-disable-next-line @typescript-eslint/ban-types
  T extends {}
  ? {
      readonly [K in keyof T]: DeepPartial<T[K]>
    }
  : Partial<T>

export type Simplify<T> = {
  [P in keyof T]: T[P]
}

export type ElementOf<T> = T extends Array<infer E> ? E : never

export type PartialWithout<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>

export type RequiredWithout<T, K extends keyof T> = Pick<T, K> & Required<Omit<T, K>>

export type ReadonlyWithout<T, K extends keyof T> = Pick<T, K> & Readonly<Omit<T, K>>

export type MutableWithout<T, K extends keyof T> = Pick<T, K> & Mutable<Omit<T, K>>

export type PartialWith<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

export type RequiredWith<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>

export type ReadonlyWith<T, K extends keyof T> = Readonly<Pick<T, K>> & Omit<T, K>

export type MutableWith<T, K extends keyof T> = Mutable<Pick<T, K>> & Omit<T, K>

export type IfUnknown<T, V> = [unknown] extends [T] ? V : T

export type IfNever<T, V> = [T] extends [never] ? V : T

/**
 * 联合类型转为交叉类型
 * @example
 * ```ts
 * type A = { a: number; }
 * type B = { b: string; }
 *
 * type C = UnionToIntersection<A | B>
 * // => { a?: number; b?: string }
 * ```
 */
export type UnionToIntersection<U, K extends keyof U = keyof U> = (
  U extends any ? (u: PartialWith<U, Exclude<keyof U, K>>) => void : never
) extends (p: infer P) => any
  ? Simplify<P>
  : never
