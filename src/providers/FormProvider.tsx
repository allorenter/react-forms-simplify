import FormContext from '@/context/FormContext';

function FormProvider({ children, form }: { children: JSX.Element | JSX.Element[]; form: any }) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}

export default FormProvider;
