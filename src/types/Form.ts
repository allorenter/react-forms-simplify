export type FormValues = Record<string, any>;

export type SubmitFn = <TResponseData, TFormValues extends FormValues = FormValues>(
  values: TFormValues,
) => Promise<TResponseData | undefined>;
