import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';

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
    const onChange = (e: any) => {
      const val = e.target.value;
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
  };
}

export default useForm;
