import FormContext from '@/context/FormContext';
import { UseForm, Values } from '@/types/Form';

function FormProvider<TFormValues extends Values>({
  children,
  form,
}: {
  children: JSX.Element | JSX.Element[];
  form: UseForm<TFormValues>;
}) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}

export default FormProvider;
