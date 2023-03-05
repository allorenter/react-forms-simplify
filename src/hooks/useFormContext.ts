import { useContext } from 'react';
import FormContext from '@/context/FormContext';
import { Values, UseForm } from '@/types/Form';

function useFormContext<TFormValues extends Values>() {
  return useContext(FormContext) as UseForm<TFormValues>;
}

export default useFormContext;
