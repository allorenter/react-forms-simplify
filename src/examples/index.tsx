import React, { ChangeEvent, useEffect, useState } from 'react';
import useForm from '@/hooks/useForm';
import FormProvider from '@/providers/FormProvider';
import useFormContext from '@/hooks/useFormContext';

type TFieldValues = {
  prueba2: string;
  prueba1: string;
};

function Example() {
  const form = useForm<TFieldValues>();
  const { submit, bind, bindCheckbox, reset } = form;

  const onSubmit = (values) => {
    console.log('values', values);

    return new Promise((resolve) => {
      resolve({});
    });
  };

  const handleReset = () => {
    reset({
      prueba1: '',
      prueba2: ['A'],
    });
  };

  return (
    <div className='example'>
      <h1>EXAMPLE</h1>
      <div>
        <FormProvider form={form}>
          <form onSubmit={submit(onSubmit)}>
            <input {...bind('prueba1')} />

            <input {...bindCheckbox('prueba2', 'A')} />
            <input {...bindCheckbox('prueba2', 'B')} />

            <button type='submit'>Enviar</button>
            <button type='button' onClick={handleReset}>
              RESET
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default Example;
