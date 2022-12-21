import { FormEvent, RefObject } from 'react';
import useWatchFormField from '@/hooks/useWatchFormField';
import FormFieldsSubscriptions from '@/logic/FormFieldsSubscriptions';
import useBindFormField from '@/hooks/useBindFormField';
import FormFieldsTouchedSubscriptions from '@/logic/FormFieldsTouchedSubscriptions';
import FormFieldsErrorsSubscriptions from '@/logic/FormFieldsErrorsSubscriptions';

export type FormFields = Record<string, any>;

export type SubmitFn<TSubmitFormFields> = (values: TSubmitFormFields) => Promise<any>;

// type Form = ReturnType<typeof useForm>;
export type UseFormParams =
  | {
      formFieldsSubscriptions?: FormFieldsSubscriptions;
      formFieldsTouchedSubscriptions?: FormFieldsTouchedSubscriptions;
      formFieldsErrorsSubcriptions?: FormFieldsErrorsSubscriptions;
    }
  | undefined;

export type UseBindFormField = ReturnType<typeof useBindFormField>;

export type useWatchFormField = ReturnType<typeof useWatchFormField>;

export type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

export type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;

export type UseForm<TFormValues> = {
  bindFormField: (
    name: Join<PathsToStringProps<TFormValues>, '.'>,
    options?: BindFormFieldOptions,
  ) => {
    name: Join<PathsToStringProps<TFormValues>, '.'>;
    onChange: (e: any) => void;
    ref: RefObject<HTMLInputElement>;
  };
  handleSubmit: (
    submitFn: SubmitFn<TFormValues>,
  ) => (e: FormEvent<HTMLFormElement>) => Promise<unknown> | void;
  getValue: (
    name?: Join<PathsToStringProps<TFormValues>, '.'> | undefined,
  ) => TFormValues | TFormValues[Join<PathsToStringProps<TFormValues>, '.'>];
  formFieldsSubscriptions: FormFieldsSubscriptions;
  setValue: (name: Join<PathsToStringProps<TFormValues>, '.'>, value: any) => void;
  reset: (values: TFormValues) => void;
  initFormField: (name: Join<PathsToStringProps<TFormValues>, '.'>) => void;
  formFieldsTouchedSubcriptions: FormFieldsTouchedSubscriptions;
  formFieldsErrorsSubcriptions: FormFieldsErrorsSubscriptions;
  getErrors: () => FormFieldsErrors;
  setFocus: (name: Join<PathsToStringProps<TFormValues>, '.'>) => void;
  isSubmitting: boolean;
  initFormFieldValidation: (
    name: Join<PathsToStringProps<TFormValues>, '.'>,
    validation: Validation | undefined,
  ) => void;
  setFormFieldRef: (key: string) => void | RefObject<HTMLInputElement>;
  getFormFieldRef: (key: string) => void | RefObject<HTMLInputElement>;
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
