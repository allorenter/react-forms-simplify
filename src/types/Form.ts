import { FormEvent } from 'react';
import useBindFormControl from '@/hooks/useBindFormField';
import useWatchFormField from '@/hooks/useWatchFormField';
import FormFieldsSubscriptions from '@/logic/FormFieldsSubscriptions';

export type FormFields = Record<string, any>;

export type SubmitFn<TSubmitFormFields> = <TResponseData>(
  values: TSubmitFormFields,
) => Promise<TResponseData | undefined>;

// type Form = ReturnType<typeof useForm>;
export type UseFormParams =
  | {
      formFieldsSubscriptions?: FormFieldsSubscriptions;
    }
  | undefined;

export type UseForm<TFormFields> = {
  bindFormControl: (name: keyof TFormFields) => {
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
  getInputRef: (key: string) => void | React.RefObject<unknown>;
  reset: (values: TFormFields) => void;
};

export type UseBindFormControl = ReturnType<typeof useBindFormControl>;

export type useWatchFormField = ReturnType<typeof useWatchFormField>;
