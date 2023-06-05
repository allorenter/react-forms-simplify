import { useEffect, useState } from 'react';
import { UseForm, Values } from '..';

function useSubmitCount<TFormValues extends Values>({ form }: { form: UseForm<TFormValues> }) {
  const [submitCount, setSubmitCount] = useState(0);

  useEffect(() => {
    if (form.isSubmitting) {
      setSubmitCount((prev) => prev + 1);
    }
  }, [form.isSubmitting]);

  return submitCount;
}

export default useSubmitCount;
