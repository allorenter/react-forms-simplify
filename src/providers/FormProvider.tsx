import FormContext from '@/context/FormContext';
import { FormFields, UseForm } from '@/types/Form';

function FormProvider<TFormValues extends FormFields>({
  children,
  form,
}: {
  children: JSX.Element | JSX.Element[];
  form: UseForm<TFormValues>;
}) {
  return (
    <FormContext.Provider value={form} key={'0'}>
      {children}
    </FormContext.Provider>
  );
}

export default FormProvider;
