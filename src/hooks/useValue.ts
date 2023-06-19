import { useEffect, useState } from 'react';
import { Values, FormName, UseForm, FormValue } from '@/types/Form';
import { SplitNestedValue } from '@/types/Utils';

function useValue<TFormValues extends Values = Values>(p: {
  form: UseForm<TFormValues>;
}): SplitNestedValue<TFormValues>;

function useValue<
  TFormValues extends Values = Values,
  TName extends FormName<TFormValues> = FormName<TFormValues>,
>(props: { name: TName; form: UseForm<TFormValues> }): FormValue<TFormValues, TName>;

function useValue<TFormValues extends Values = Values>(p: {
  name?: any;
  form: UseForm<TFormValues>;
}): any {
  const { form, name } = p;
  const GET_ALL = !(typeof name === 'string' && name?.length > 0);

  const initialValue =
    form.getValue(name) === undefined
      ? form?.$instance?.initialValues?.[name]
      : form.getValue(name);
  const initialAllValues =
    form.getValue() === undefined || Object.keys(form.getValue() || {}).length === 0
      ? form?.$instance?.initialValues
      : form.getValue();

  const [value, setValue] = useState<any>(GET_ALL ? initialAllValues : initialValue);

  const { valuesSubscriptions } = form.$instance;

  useEffect(() => {
    const unsubscribeFn = GET_ALL
      ? valuesSubscriptions.subscribeAll(() => {
          setValue(form.getValue());
        })
      : valuesSubscriptions.subscribe(name, setValue);

    return () => unsubscribeFn?.();
  }, []);

  return value;
}

export default useValue;
