import FormValuesSubscriptions from '@/logic/FormValuesSubscriptions';
import { useCallback, useRef } from 'react';

const formValuesSubscriptions = new FormValuesSubscriptions();

// HAY QUE IMPLEMENTAR DOTNOTATION PARA get y setValue
function useForm() {
  const formValuesRef = useRef<{
    [key: string]: any;
  }>({});

  const getValue = useCallback((key?: string | undefined) => {
    if (key === undefined) return formValuesRef;
    return formValuesRef[key];
  }, []);

  const setValue = useCallback((name: string, value: any) => {
    formValuesRef.current[name] = value;
  }, []);

  const bindControl = useCallback((name: string) => {
    formValuesSubscriptions.addSubscription(name);

    const onChange = (e: any) => {
      const val = e.target.value;
      formValuesSubscriptions.publish(name, val);
      setValue(name, val);
    };

    return {
      value: formValuesRef.current[name],
      onChange,
    };
  }, []);

  const handleSubmit = useCallback(
    (submitFn) => (e) => {
      e.preventDefault();
      submitFn(formValuesRef.current);
    },
    [],
  );

  return {
    bindControl,
    handleSubmit,
    getValue,
    formValuesSubscriptions,
  };
}

export default useForm;
