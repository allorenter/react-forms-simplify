import { FormEvent } from 'react';
import useWatchFormField from '@/hooks/useWatchFormField';
import FormFieldsSubscriptions from '@/logic/FormFieldsSubscriptions';
import useBindFormField from '@/hooks/useBindFormField';
import FormFieldsTouchedSubscriptions from '@/logic/FormFieldsTouchedSubscriptions';

export type FormFields = Record<string, any>;

export type SubmitFn<TSubmitFormFields> = <TResponseData>(
  values: TSubmitFormFields,
) => Promise<TResponseData | undefined>;

// type Form = ReturnType<typeof useForm>;
export type UseFormParams =
  | {
    formFieldsSubscriptions?: FormFieldsSubscriptions;
    formFieldsTouchedSubscriptions?: FormFieldsTouchedSubscriptions;
  }
  | undefined;

export type UseForm<TFormValues> = {
  bindFormField: (name: keyof TFormValues) => {
    name: keyof TFormValues;
    onChange: (e: any) => void;
    ref: void | React.RefObject<unknown>;
  };
  handleSubmit: (
    submitFn: SubmitFn<TFormValues>,
  ) => (e: FormEvent<HTMLFormElement>) => Promise<unknown>;
  getValue: (name?: keyof TFormValues | undefined) => TFormValues | TFormValues[keyof TFormValues];
  formFieldsSubscriptions: FormFieldsSubscriptions;
  setValue: (name: keyof TFormValues, value: any) => void;
  reset: (values: TFormValues) => void;
  initFormField: (name: keyof TFormValues) => void;
  formFieldsTouchedSubcriptions: FormFieldsTouchedSubscriptions;
};

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

export type TouchedFormFields = Record<string, boolean>;
