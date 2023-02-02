import { FormEvent, RefObject } from 'react';
import useValue from '@/hooks/useValue';
import FormFieldsSubscriptions from '@/logic/FormFieldsSubscriptions';
import useBind from '@/hooks/useBind';
import FormFieldsTouchedSubscriptions from '@/logic/FormFieldsTouchedSubscriptions';
import FormFieldsErrorsSubscriptions from '@/logic/FormFieldsErrorsSubscriptions';

export type FormFields = Record<string, any>;

export type SubmitFn = (values: any) => any;

export type UseFormParams =
  | {
      $instance: {
        formFieldsSubscriptions?: FormFieldsSubscriptions;
        formFieldsTouchedSubscriptions?: FormFieldsTouchedSubscriptions;
        formFieldsErrorsSubscriptions?: FormFieldsErrorsSubscriptions;
      };
    }
  | undefined;

export type UseBindFormField = ReturnType<typeof useBind>;

export type useValue = ReturnType<typeof useValue>;

type PathsToStringProps<T> = T extends string
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

export type FormName<TFormValues extends FormFields> = Join<PathsToStringProps<TFormValues>, '.'>;

export type UseForm<TFormValues extends FormFields> = {
  bind: (
    name: FormName<TFormValues>,
    options?: BindFormFieldOptions,
  ) => {
    name: FormName<TFormValues>;
    onChange: (e: any) => void;
    ref: RefObject<HTMLInputElement>;
  };
  submit: (submitFn: SubmitFn) => (e: FormEvent<HTMLFormElement>) => Promise<unknown> | void;
  getValue: (
    name?: FormName<TFormValues> | undefined,
  ) => TFormValues | TFormValues[FormName<TFormValues>];
  setValue: (name: FormName<TFormValues>, value: any) => void;
  reset: (values: TFormValues) => void;
  getErrors: () => FormFieldsErrors;
  setFocus: (name: FormName<TFormValues>) => void;
  isSubmitting: boolean;
  bindCheckbox: (
    name: FormName<TFormValues>,
    value: string,
    options?: BindFormFieldOptions,
  ) => void;
  $instance: {
    setFormFieldRef: (key: string) => void | RefObject<HTMLInputElement>;
    getFormFieldRef: (key: string) => void | RefObject<HTMLInputElement>;
    initFormFieldValidation: (
      name: FormName<TFormValues>,
      validation: Validation | undefined,
    ) => void;
    initFormField: (name: FormName<TFormValues>) => void;
    formFieldsTouchedSubscriptions: FormFieldsTouchedSubscriptions;
    formFieldsErrorsSubscriptions: FormFieldsErrorsSubscriptions;
    formFieldsSubscriptions: FormFieldsSubscriptions;
  };
};

export type TouchedFormFields = Record<string, boolean>;

export type ValidateFunction = (val: any) => any;

export type Validation = {
  required?: boolean;
  validateFunction?: ValidateFunction;
};

export type FormFieldsValidations = Record<string, Validation>;

export type BindFormFieldOptions =
  | {
      validation: Validation;
    }
  | undefined;

export type FormFieldError =
  | {
      name: string;
      type: 'validateFunction' | 'required';
      message?: string | undefined;
    }
  | undefined;

export type FormFieldsErrors = Record<string, FormFieldError>;
