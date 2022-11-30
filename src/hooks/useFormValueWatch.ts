import { useEffect, useState } from 'react';
import FormValuesSubscriptions from '@/logic/FormValuesSubscriptions';

function useFormValueWatch({
  name,
  formValuesSubscriptions,
}: {
  name: string;
  formValuesSubscriptions: FormValuesSubscriptions;
}) {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const unsubscribeFn = formValuesSubscriptions.subscribe(name, setValue);
    return () => unsubscribeFn?.();
  }, [formValuesSubscriptions]);

  return value;
}

export default useFormValueWatch;
