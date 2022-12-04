import useBindFormControl from '@/hooks/useBindFormControl';
import useForm from '@/hooks/useForm';
import useFormValueWatch from '@/hooks/useFormValuewatch';
import FormValuesSubscriptions from '@/logic/FormValuesSubscriptions';

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

export type UseForm = ReturnType<typeof useForm>;

export type UseBindFormControl = ReturnType<typeof useBindFormControl>;

export type UseFormValueWatch = ReturnType<typeof useFormValueWatch>;
