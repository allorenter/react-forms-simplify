import { Values } from './Form';

declare const $NestedValue: unique symbol;

export declare type NestedValue<
  TValue extends unknown[] | Record<string, unknown> | Map<unknown, unknown> =
    | unknown[]
    | Record<string, unknown>,
> = {
  [$NestedValue]: never;
} & TValue;

export declare type Primitive = null | undefined | string | number | boolean | symbol | bigint;
export declare type EmptyObject = {
  [K in string | number]: never;
};
export declare type NonUndefined<T> = T extends undefined ? never : T;
export declare type LiteralUnion<T extends U, U extends Primitive> =
  | T
  | (U & {
      _?: never;
    });
export declare type DeepPartial<T> = T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {
      [key in keyof T]: T[key];
    }
  ? {
      [K in keyof T]?: DeepPartial<T[K]>;
    }
  : T;
export declare type IsAny<T> = boolean extends (T extends never ? true : false) ? true : false;
export declare type DeepMap<T, TValue> = {
  [K in keyof T]?: IsAny<T[K]> extends true
    ? any
    : NonUndefined<T[K]> extends NestedValue | Date | FileList
    ? TValue
    : NonUndefined<T[K]> extends object
    ? DeepMap<T[K], TValue>
    : NonUndefined<T[K]> extends Array<infer U>
    ? IsAny<U> extends true
      ? Array<any>
      : U extends NestedValue | Date | FileList
      ? Array<TValue>
      : U extends object
      ? Array<DeepMap<U, TValue>>
      : Array<TValue>
    : TValue;
};
export declare type IsFlatObject<T extends object> = Extract<
  Exclude<T[keyof T], NestedValue | Date | FileList>,
  any[] | object
> extends never
  ? true
  : false;
declare type Digits = '0' | NonZeroDigits;
declare type NonZeroDigits = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
declare type IsPrimitive<T> = T extends Primitive ? true : false;
declare type ArrayKey = number | `${number}`;
declare type ValueOf<T> = T[keyof T];
export declare type FieldPath<Root> = Root extends ReadonlyArray<infer E>
  ? IsPrimitive<E> extends true
    ? ArrayKey
    : ArrayKey | `${ArrayKey}.${FieldPath<E>}`
  : ValueOf<{
      [K in keyof Root]: IsPrimitive<Root[K]> extends true
        ? K & string
        : (K & string) | `${K & string}.${FieldPath<Root[K]>}`;
    }>;
export declare type FieldPathValue<
  TFieldValues extends Values,
  TPath extends FieldPath<TFieldValues>,
> = TPath extends `${infer Key}.${infer Rest}`
  ? Key extends keyof TFieldValues
    ? Rest extends FieldPath<TFieldValues[Key]>
      ? FieldPathValue<TFieldValues[Key], Rest>
      : TFieldValues[Key] extends (infer U)[]
      ? U
      : never
    : Key extends Digits
    ? Key & number extends keyof TFieldValues
      ? Rest extends FieldPath<TFieldValues[Key & number]>
        ? FieldPathValue<TFieldValues[Key & number], Rest>
        : TFieldValues[Key] extends (infer U)[]
        ? U
        : never
      : never
    : never
  : TPath extends keyof TFieldValues
  ? TFieldValues[TPath]
  : TPath & number extends keyof TFieldValues
  ? TFieldValues[TPath & number]
  : never;
export declare type FieldPathValues<
  TFieldValues extends Values,
  TPath extends FieldPath<TFieldValues>[],
  // eslint-disable-next-line @typescript-eslint/ban-types
> = {} & {
  [K in keyof TPath]: FieldPathValue<TFieldValues, TPath[K] & FieldPath<TFieldValues>>;
};
export {};
