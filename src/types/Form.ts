import { FormEvent, RefObject } from 'react';
import FormNameSubscriptions from '@/logic/FormNameSubscriptions';
import useBind from '@/hooks/useBind';
import Subscriptions from '@/logic/Subscriptions';
import {
  ArrayKey,
  Digits,
  IsPrimitive,
  RecursivePartial,
  SplitNestedValue,
  ValueOf,
} from './Utils';

export type FormName<Root> = Root extends ReadonlyArray<infer E>
  ? IsPrimitive<E> extends true
    ? ArrayKey
    : ArrayKey | `${ArrayKey}.${FormName<E>}`
  : ValueOf<{
      [K in keyof Root]: IsPrimitive<Root[K]> extends true
        ? K & string
        : (K & string) | `${K & string}.${FormName<Root[K]>}`;
    }>;

export type FormValue<
  TFormValues extends Values,
  TPath extends FormName<TFormValues>,
> = TPath extends `${infer Key}.${infer Rest}`
  ? Key extends keyof TFormValues
    ? Rest extends FormName<TFormValues[Key]>
      ? FormValue<TFormValues[Key], Rest>
      : TFormValues[Key] extends (infer U)[]
      ? U
      : never
    : Key extends Digits
    ? Key & number extends keyof TFormValues
      ? Rest extends FormName<TFormValues[Key & number]>
        ? FormValue<TFormValues[Key & number], Rest>
        : TFormValues[Key] extends (infer U)[]
        ? U
        : never
      : never
    : never
  : TPath extends keyof TFormValues
  ? TFormValues[TPath]
  : TPath & number extends keyof TFormValues
  ? TFormValues[TPath & number]
  : never;

export type Values = Record<string, any>;

export type InitializedValues = Record<string, boolean>;

export type SubmitFn<TFormValues> = (values: TFormValues) => any;

export type UseFormParams<TFormValues extends Values = Values> =
  | {
      $instance?: {
        valuesSubscriptions?: FormNameSubscriptions;
        touchedSubscriptions?: Subscriptions;
        errorsSubscriptions?: FormNameSubscriptions;
      };
      defaultValues?: DefaultValues<TFormValues>;
    }
  | undefined;

export type UseBindValue = ReturnType<typeof useBind>;

export type DefaultValues<TFormValues> = SplitNestedValue<RecursivePartial<TFormValues>>;

export type UseForm<TFormValues extends Values = Values> = {
  bind: (
    name: FormName<TFormValues>,
    options?: BindOptions,
  ) => {
    name: FormName<TFormValues>;
    onChange: (e: any) => void;
    ref: RefObject<HTMLInputElement>;
  };
  bindNumber: (
    name: FormName<TFormValues>,
    options?: BindOptions,
  ) => {
    name: FormName<TFormValues>;
    onChange: (e: any) => void;
    ref: RefObject<HTMLInputElement>;
  };
  submit: (
    submitFn: SubmitFn<TFormValues>,
  ) => (e: FormEvent<HTMLFormElement>) => Promise<unknown> | void;
  getValue: {
    (): SplitNestedValue<TFormValues>;
    (n: undefined): SplitNestedValue<TFormValues>;
    <TName extends FormName<TFormValues>>(name: TName): FormValue<TFormValues, TName>;
  };
  setValue: <TName extends FormName<TFormValues>>(
    name: TName,
    value: FormValue<TFormValues, TName>,
  ) => void;
  reset: (values: DefaultValues<TFormValues>) => void;
  getErrors: () => FormErrors;
  setFocus: (name: FormName<TFormValues>) => void;
  isSubmitting: boolean;
  bindCheckbox: (
    name: FormName<TFormValues>,
    value: string,
    options?: BindOptions,
  ) => {
    name: FormName<TFormValues>;
    ref: RefObject<HTMLInputElement>;
    type: string;
    value: string;
    onChange: (e: any) => void;
  };
  bindRadio: (
    name: FormName<TFormValues>,
    value: string,
    options?: BindOptions,
  ) => {
    name: FormName<TFormValues>;
    ref: RefObject<HTMLInputElement>;
    type: string;
    value: string;
    onChange: (e: any) => void;
  };
  $instance: {
    initializedValues: InitializedValues;
    values: Values;
    touchedValues: TouchedValues;
    errors: FormErrors;
    valuesValidations: ValidationValues;
    valuesSubscriptions: FormNameSubscriptions;
    touchedSubscriptions: Subscriptions;
    errorsSubscriptions: FormNameSubscriptions;
    bindUnsubscribeFns: BindUnsubscribeFns;
    setInputRef: (key: string) => any;
    getInputRef: (key: string) => any;
    initialValues: any;
  };
};

export type TouchedValues = Record<string, boolean>;

export type ValidateFunction = (val: any) => boolean | string;

export interface Validation {
  required?: boolean;
  validateFunction?: ValidateFunction;
}

export type ValidationValues = Record<string, Validation>;

export type ValueType = 'text' | 'radio' | 'checkbox' | 'number';

export type TypeValues = Record<string, ValueType>;

export type InputsRefs = Record<string, RefObject<HTMLInputElement>>;

export interface BindOptions extends Validation {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type ValueError =
  | {
      name: string;
      type: 'validateFunction' | 'required';
      message?: string | undefined;
    }
  | undefined;

export type FormErrors = Record<string, ValueError>;

export type UseBindOptions = Validation;

export type BindUnsubscribeFn = () => void | null;

export type BindUnsubscribeFns = Record<string, BindUnsubscribeFn | BindUnsubscribeFn[]>;

export type UpdateInputValue = (value: any) => void;

export type UpdateInputInvalid = (value: ValueError) => void;
