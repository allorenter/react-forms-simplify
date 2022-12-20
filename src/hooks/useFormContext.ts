import { useContext } from 'react';
import FormContext from '@/context/FormContext';
import { UseForm } from '@/types/Form';

function useFormContext<TFormValues>() {
  return useContext(FormContext) as UseForm<TFormValues>;
}

export default useFormContext;
