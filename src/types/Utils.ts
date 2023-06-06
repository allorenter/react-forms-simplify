declare const $NestedValue: unique symbol;

export type NestedValue<
  TValue extends unknown[] | Record<string, unknown> | Map<unknown, unknown> =
    | unknown[]
    | Record<string, unknown>,
> = {
  [$NestedValue]: never;
} & TValue;

export type Primitive = null | undefined | string | number | boolean | symbol | bigint;

export type EmptyObject = {
  [K in string | number]: never;
};
export type NonUndefined<T> = T extends undefined ? never : T;

export type LiteralUnion<T extends U, U extends Primitive> =
  | T
  | (U & {
      _?: never;
    });

export type RecursivePartial<T> = T extends Array<infer U>
  ? Array<RecursivePartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<RecursivePartial<U>>
  : T extends {
      [key in keyof T]: T[key];
    }
  ? {
      [K in keyof T]?: RecursivePartial<T[K]>;
    }
  : T;

export type IsAny<T> = boolean extends (T extends never ? true : false) ? true : false;

export type RecursiveMap<T, TValue> = {
  [K in keyof T]?: IsAny<T[K]> extends true
    ? any
    : NonUndefined<T[K]> extends NestedValue | Date | FileList
    ? TValue
    : NonUndefined<T[K]> extends object
    ? RecursiveMap<T[K], TValue>
    : NonUndefined<T[K]> extends Array<infer U>
    ? IsAny<U> extends true
      ? Array<any>
      : U extends NestedValue | Date | FileList
      ? Array<TValue>
      : U extends object
      ? Array<RecursiveMap<U, TValue>>
      : Array<TValue>
    : TValue;
};

export type IsFlatObject<T extends object> = Extract<
  Exclude<T[keyof T], NestedValue | Date | FileList>,
  any[] | object
> extends never
  ? true
  : false;

export type Digits = '0' | NonZeroDigits;

export type NonZeroDigits = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type IsPrimitive<T> = T extends Primitive ? true : false;

export type ArrayKey = number | `${number}`;

export type ValueOf<T> = T[keyof T];

export type SplitNestedValue<T> = T extends NestedValue<infer U>
  ? U
  : T extends Date | FileList
  ? T
  : T extends Record<string, unknown>
  ? {
      [K in keyof T]: SplitNestedValue<T[K]>;
    }
  : T;
