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

export type UseForm<TFormFields> = {
  bindFormField: (name: keyof TFormFields) => {
    name: keyof TFormFields;
    onChange: (e: any) => void;
    ref: void | React.RefObject<unknown>;
  };
  handleSubmit: (
    submitFn: SubmitFn<TFormFields>,
  ) => (e: FormEvent<HTMLFormElement>) => Promise<unknown>;
  getValue: (name?: keyof TFormFields | undefined) => TFormFields | TFormFields[keyof TFormFields];
  formFieldsSubscriptions: FormFieldsSubscriptions;
  setValue: (name: keyof TFormFields, value: any) => void;
  reset: (values: TFormFields) => void;
  initFormField: (name: keyof TFormFields) => void;
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
