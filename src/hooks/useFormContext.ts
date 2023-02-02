import { useContext } from 'react';
import FormContext from '@/context/FormContext';
import { NamesValues, UseForm } from '@/types/Form';

function useFormContext<TFormValues extends NamesValues>() {
  return useContext(FormContext) as UseForm<TFormValues>;
}

export default useFormContext;
