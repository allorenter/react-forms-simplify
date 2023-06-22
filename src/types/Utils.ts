declare const $NestedValue: unique symbol;

export type NestedValue<
  TValue extends unknown[] | Record<string, unknown> | Map<unknown, unknown> =
    | unknown[]
    | Record<string, unknown>,
> = {
  [$NestedValue]: never;
} & TValue;

export type Primitive = null | string | number | boolean | symbol | bigint;

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
