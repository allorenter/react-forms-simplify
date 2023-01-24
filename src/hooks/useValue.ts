import { useEffect, useState } from 'react';
import { FormFields, Join, PathsToStringProps, UseForm } from '@/types/Form';

function useValue<TFormValues extends FormFields = FormFields>({
  name,
  form,
}: {
  name: Join<PathsToStringProps<TFormValues>, '.'>;
  form: UseForm<TFormValues>;
}) {
  const [value, setValue] = useState<any>();
  const { formFieldsSubscriptions } = form;

  useEffect(() => {
    const unsubscribeFn = formFieldsSubscriptions.subscribe(name, setValue);
    return () => unsubscribeFn?.();
  }, []);

  return value;
}

export default useValue;
