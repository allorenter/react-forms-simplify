import { useEffect, useState } from 'react';
import FormFieldsSubscriptions from '@/logic/FormFieldsSubscriptions';

function useWatchFormField({
  name,
  formFieldsSubscriptions,
}: {
  name: string;
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
