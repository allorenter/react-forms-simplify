export type FormValues = Record<string, any>;

export type SubmitFn<TSubmitFormValues> = <TResponseData>(
  values: TSubmitFormValues,
) => Promise<TResponseData | undefined>;

// type Form = ReturnType<typeof useForm>;
