import FormValuesSubscriptions from '@/logic/FormValuesSubscriptions';
import { useEffect, useState } from 'react';

function useFormValueWatch({
  name,
  formValuesSubscriptions,
}: {
  name: string;
  formValuesSubscriptions: FormValuesSubscriptions;
}) {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    formValuesSubscriptions.addSubscriber(name, setValue);
  }, [formValuesSubscriptions]);

  return value;
}

export default useFormValueWatch;
