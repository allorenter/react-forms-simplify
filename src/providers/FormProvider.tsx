import FormContext from '@/context/FormContext';
import { UseForm } from '@/types/Form';

function FormProvider<TFormValues>({
  children,
  form,
}: {
  children: JSX.Element | JSX.Element[];
  form: UseForm<TFormValues>;
}) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}

export default FormProvider;
