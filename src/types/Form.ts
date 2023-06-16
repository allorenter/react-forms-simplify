import { FormEvent, RefObject } from 'react';
import useValue from '@/hooks/useValue';
import ValuesSubscriptions from '@/logic/ValuesSubscriptions';
import useBind from '@/hooks/useBind';
import TouchedSubscriptions from '@/logic/TouchedSubscriptions';
import ErrorsSubscriptions from '@/logic/ErrorsSubscriptions';
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
        valuesSubscriptions?: ValuesSubscriptions;
        touchedSubscriptions?: TouchedSubscriptions;
        errorsSubscriptions?: ErrorsSubscriptions;
      };
      defaultValues?: DefaultValues<TFormValues>;
    }
  | undefined;

export type UseBindValue = ReturnType<typeof useBind>;

export type useValue = ReturnType<typeof useValue>;

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
    setInputRef: (key: string) => void | RefObject<HTMLInputElement>;
    getInputRef: (key: string) => void | RefObject<HTMLInputElement>;
    initValueValidation: (name: FormName<TFormValues>, validation: Validation | undefined) => void;
    initValue: (name: FormName<TFormValues>) => void;
    touchedSubscriptions: TouchedSubscriptions;
    errorsSubscriptions: ErrorsSubscriptions;
    valuesSubscriptions: ValuesSubscriptions;
    initialValues?: any;
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

export type UFInitValueValidationArgs<TFormValues extends Values = Values> = {
  name: FormName<TFormValues>;
  bindOptions?: BindOptions;
};
