import { Values, FormErrors, UseForm, ValueError, FormName } from '@/types/Form';
import { useEffect, useState } from 'react';

function useError<TFormValues extends Values = Values>(p: {
  form: UseForm<TFormValues>;
}): FormErrors;
function useError<
  TFormValues extends Values = Values,
  TName extends FormName<TFormValues> = FormName<TFormValues>,
>(p: { name: TName; form: UseForm<TFormValues> }): ValueError;
function useError<TFormValues extends Values = Values>(p: {
  name?: any;
  form: UseForm<TFormValues>;
}): any {
  const { name, form } = p;
  const GET_ALL = !(typeof name === 'string' && name?.length > 0);

  const [errors, setErrors] = useState<FormErrors | ValueError | undefined>();

  const { errorsSubscriptions } = form.$instance;

  useEffect(() => {
    const unsubscribeFn = GET_ALL
      ? errorsSubscriptions.subscribeAll(() => {
          setErrors(form.getErrors());
        })
      : errorsSubscriptions.subscribe(name, setErrors);
    return () => unsubscribeFn?.();
  }, []);

  if (GET_ALL) {
    const hasErrors = Object.keys(errors || {}).length > 0;

    return {
      hasErrors,
      errors,
    };
  }

  return errors;
}

export default useError;
