import { FormEvent, RefObject } from 'react';
import useValue from '@/hooks/useValue';
import ValuesSubscriptions from '@/logic/ValuesSubscriptions';
import useBind from '@/hooks/useBind';
import TouchedSubscriptions from '@/logic/TouchedSubscriptions';
import ErrorsSubscriptions from '@/logic/ErrorsSubscriptions';
import { FieldPath, FieldPathValue, NestedValue } from './Utils';

export declare type UnpackNestedValue<T> = T extends NestedValue<infer U>
  ? U
  : T extends Date | FileList
  ? T
  : T extends Record<string, unknown>
  ? {
      [K in keyof T]: UnpackNestedValue<T[K]>;
    }
  : T;

export type Values = Record<string, any>;

export type SubmitFn<TFormValues> = (values: TFormValues) => any;

export type UseFormParams =
  | {
      $instance: {
        valuesSubscriptions?: ValuesSubscriptions;
        touchedSubscriptions?: TouchedSubscriptions;
        errorsSubscriptions?: ErrorsSubscriptions;
      };
    }
  | undefined;

export type UseBindValue = ReturnType<typeof useBind>;

export type useValue = ReturnType<typeof useValue>;

type PathsToStringProps<T> = T extends string | number | boolean | Array<any>
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;

export type FormName<TFormValues extends Values> = Join<PathsToStringProps<TFormValues>, '.'>;

export type UseForm<TFormValues extends Values = Values> = {
  bind: (
    name: FormName<TFormValues>,
    options?: BindValueOptions,
  ) => {
    name: FormName<TFormValues>;
    onChange: (e: any) => void;
    ref: RefObject<HTMLInputElement>;
  };
  bindNumber: (
    name: FormName<TFormValues>,
    options?: BindValueOptions,
  ) => {
    name: FormName<TFormValues>;
    onChange: (e: any) => void;
    ref: RefObject<HTMLInputElement>;
  };
  submit: (
    submitFn: SubmitFn<TFormValues>,
  ) => (e: FormEvent<HTMLFormElement>) => Promise<unknown> | void;
  getValue: {
    (): UnpackNestedValue<TFormValues>;
    <TName extends FieldPath<TFormValues>>(fieldName: TName): FieldPathValue<TFormValues, TName>;
  };
  setValue: (name: FormName<TFormValues>, value: any) => void;
  reset: (values: TFormValues) => void;
  getErrors: () => FormErrors;
  setFocus: (name: FormName<TFormValues>) => void;
  isSubmitting: boolean;
  bindCheckbox: (
    name: FormName<TFormValues>,
    value: string,
    options?: BindValueOptions,
  ) => {
    name: Join<PathsToStringProps<TFormValues>, '.'>;
    ref: RefObject<HTMLInputElement>;
    type: string;
    value: string;
    onChange: (e: any) => void;
  };
  bindRadio: (
    name: FormName<TFormValues>,
    value: string,
    options?: BindValueOptions,
  ) => {
    name: Join<PathsToStringProps<TFormValues>, '.'>;
    ref: RefObject<HTMLInputElement>;
    type: string;
    value: string;
    onChange: (e: any) => void;
  };
  $instance: {
    setInputRef: (key: string) => void | RefObject<HTMLInputElement>;
    getInputRef: (key: string) => void | RefObject<HTMLInputElement>;
    initValueValidation: (name: FormName<TFormValues>, validation: Validation | undefined) => void;
    initValue: (name: FormName<TFormValues>) => void;
    touchedSubscriptions: TouchedSubscriptions;
    errorsSubscriptions: ErrorsSubscriptions;
    valuesSubscriptions: ValuesSubscriptions;
  };
};

export type TouchedValues = Record<string, boolean>;

export type ValidateFunction = (val: any) => boolean | string;

export type Validation = {
  required?: boolean;
  validateFunction?: ValidateFunction;
};

export type ValidationValues = Record<string, Validation>;

export type ValueType = 'text' | 'radio' | 'checkbox' | 'number';

export type TypeValues = Record<string, ValueType>;

export type BindValueOptions =
  | {
      validation: Validation;
    }
  | undefined;

export type ValueError =
  | {
      name: string;
      type: 'validateFunction' | 'required';
      message?: string | undefined;
    }
  | undefined;

export type FormErrors = Record<string, ValueError>;
