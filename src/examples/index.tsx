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

  return (
    <div className='example'>
      <h1>EXAMPLE</h1>
      <div>
        <FormProvider form={form}>
          <form></form>
        </FormProvider>
      </div>
    </div>
  );
}

export default Example;
