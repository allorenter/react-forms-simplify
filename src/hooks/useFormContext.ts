import { useContext } from 'react';
import FormContext from '@/context/FormContext';
import { FormFields, UseForm } from '@/types/Form';

function useFormContext<TFormValues extends FormFields>() {
  return useContext(FormContext) as UseForm<TFormValues>;
}

export default useFormContext;
