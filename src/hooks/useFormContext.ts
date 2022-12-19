import FormContext from '@/context/FormContext';
import { UseForm } from '@/types/Form';
import { useContext } from 'react';

function useFormContext<TFormValues>() {
  return useContext(FormContext) as UseForm<TFormValues>;
}

export default useFormContext;
