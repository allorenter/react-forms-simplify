import FormContext from '@/context/FormContext';
import { useContextSelector } from 'use-context-selector';

function useFormContext(selector: string) {
  const contextVal = useContextSelector(FormContext, (contextValues: any) => {
    return contextValues[selector];
  });

  return contextVal;
}

export default useFormContext;
