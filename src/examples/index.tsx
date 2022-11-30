import React, { ChangeEvent, useEffect, useState } from 'react';
// import useForm from '@/hooks/useForm';
import './index.css';
import useForm from '@/hooks/useForm';
import useFormValueWatch from '@/hooks/useFormValuewatch';
import FormProvider from '@/providers/FormProvider';
import useFormContext from '@/hooks/useFormContext';
import useFormHistory from '@/hooks/useFormHistory';

function SecondLevelPrueba() {
  const formValuesSubscriptions = useFormContext('formValuesSubscriptions');
  const pruebasValue = useFormValueWatch({ name: 'prueba2', formValuesSubscriptions });

  console.log('RENDER PRUEBA', pruebasValue);

  return <p>Second Level Component {pruebasValue}</p>;
}

function SecondLevelPrueba1() {
  const formValuesSubscriptions = useFormContext('formValuesSubscriptions');
  const pruebasValue = useFormValueWatch({ name: 'prueba1', formValuesSubscriptions });

  console.log('RENDER PRUEBA 1', pruebasValue);

  return pruebasValue;
}

type TFieldValues = {
  prueba2: string;
  prueba1: string;
};

function Example() {
  const form = useForm<TFieldValues>();
  const { bindFormControl, handleSubmit, getValue, formValuesSubscriptions } = form;
  const history = useFormHistory({ formValuesSubscriptions });

  console.log('RE RENDER PARENT', history);

  const onSubmit = (values: TFieldValues) => {
    return new Promise((resolve, reject) => resolve({}));
  };

  const getValues = () => {
    const val = getValue();
    console.log('val', val);
  };

  return (
    <div className='example'>
      <h1>EXAMPLE</h1>
      <div>
        <FormProvider form={form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...bindFormControl('prueba2')} />
            <br />
            <input {...bindFormControl('prueba1')} />
            <button type='submit'>ENVIAR</button>
            <br></br>
            <button type='button' onClick={getValues}>
              GET VALUES
            </button>
            <SecondLevelPrueba />
            <SecondLevelPrueba1 />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default Example;
