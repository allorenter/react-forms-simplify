import { FormEvent, RefObject } from 'react';
import useValue from '@/hooks/useValue';
import FormFieldsSubscriptions from '@/logic/FormFieldsSubscriptions';
import useBind from '@/hooks/useBind';
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

export type UseBindFormField = ReturnType<typeof useBind>;

export type useValue = ReturnType<typeof useValue>;

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
  bind: (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    name: Join<PathsToStringProps<TFormValues>, '.'>,
    options?: BindFormFieldOptions,
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    name: Join<PathsToStringProps<TFormValues>, '.'>;
    onChange: (e: any) => void;
    ref: RefObject<HTMLInputElement>;
  };
  submit: (
    submitFn: SubmitFn<TFormValues>,
  ) => (e: FormEvent<HTMLFormElement>) => Promise<unknown> | void;
  getValue: (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    name?: Join<PathsToStringProps<TFormValues>, '.'> | undefined,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
  ) => TFormValues | TFormValues[Join<PathsToStringProps<TFormValues>, '.'>];
  formFieldsSubscriptions: FormFieldsSubscriptions;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  setValue: (name: Join<PathsToStringProps<TFormValues>, '.'>, value: any) => void;
  reset: (values: TFormValues) => void;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  initFormField: (name: Join<PathsToStringProps<TFormValues>, '.'>) => void;
  formFieldsTouchedSubcriptions: FormFieldsTouchedSubscriptions;
  formFieldsErrorsSubcriptions: FormFieldsErrorsSubscriptions;
  getErrors: () => FormFieldsErrors;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  setFocus: (name: Join<PathsToStringProps<TFormValues>, '.'>) => void;
  isSubmitting: boolean;
  initFormFieldValidation: (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
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
