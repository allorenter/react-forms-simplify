import useBindFormControl from '@/hooks/useBindFormControl';
import useForm from '@/hooks/useForm';
import useFormValueWatch from '@/hooks/useFormValueWatch';
import FormValuesSubscriptions from '@/logic/FormValuesSubscriptions';
import { FormEvent } from 'react';

export type FormValues = Record<string, any>;

export type SubmitFn<TSubmitFormValues> = <TResponseData>(
  values: TSubmitFormValues,
) => Promise<TResponseData | undefined>;

// type Form = ReturnType<typeof useForm>;
export type UseFormParams =
  | {
      formValuesSubscriptions?: FormValuesSubscriptions;
    }
  | undefined;

export type UseForm<TFormValues> = {
  bindFormControl: (name: keyof TFormValues) => {
    name: keyof TFormValues;
    onChange: (e: any) => void;
    ref: void | React.RefObject<unknown>;
  };
  handleSubmit: (
    submitFn: SubmitFn<TFormValues>,
  ) => (e: FormEvent<HTMLFormElement>) => Promise<unknown>;
  getValue: (name?: keyof TFormValues | undefined) => TFormValues | TFormValues[keyof TFormValues];
  formValuesSubscriptions: FormValuesSubscriptions;
  setValue: (name: keyof TFormValues, value: any) => void;
  getInputRef: (key: string) => void | React.RefObject<unknown>;
  reset: (values: TFormValues) => void;
};

export type UseBindFormControl = ReturnType<typeof useBindFormControl>;

export type UseFormValueWatch = ReturnType<typeof useFormValueWatch>;
