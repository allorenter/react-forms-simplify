import { useEffect, useState } from 'react';
import FormFieldsSubscriptions from '@/logic/FormFieldsSubscriptions';
import { FormFields, Join, PathsToStringProps } from '@/types/Form';

function useWatchFormField<TFormValues extends FormFields = FormFields>({
  name,
  formFieldsSubscriptions,
}: {
  name: Join<PathsToStringProps<TFormValues>, '.'>;
  formFieldsSubscriptions: FormFieldsSubscriptions;
}) {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const unsubscribeFn = formFieldsSubscriptions.subscribe(name, setValue);
    return () => unsubscribeFn?.();
  }, [formFieldsSubscriptions]);

  return value;
}

export default useWatchFormField;
