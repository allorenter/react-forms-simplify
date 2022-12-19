import { UseForm } from '@/types/Form';
import { createContext } from 'react';

const FormContext = createContext<UseForm<any> | null>(null);

export default FormContext;
