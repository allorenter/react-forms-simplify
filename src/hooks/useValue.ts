import { useEffect, useState } from 'react';
import { FormFields, FormName, UseForm } from '@/types/Form';

function useValue<TFormValues extends FormFields = FormFields>({
  name,
  form,
}: {
  name: FormName<TFormValues>;
  form: UseForm<TFormValues>;
}) {
  const [value, setValue] = useState<any>();
  const { formFieldsSubscriptions } = form.$instance;

  useEffect(() => {
    const unsubscribeFn = formFieldsSubscriptions.subscribe(name, setValue);
    return () => unsubscribeFn?.();
  }, []);

  return value;
}

export default useValue;
