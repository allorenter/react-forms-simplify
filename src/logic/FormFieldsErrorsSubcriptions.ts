import { FormFieldsErrors, TouchedFormFields } from '@/types/Form';
import { SetStateAction } from 'react';

class FormFieldsErrorsSubscriptions {
  private subscribers: Set<SetStateAction<any>>;

  constructor() {
    this.subscribers = new Set<SetStateAction<TouchedFormFields>>();
  }

  subscribe(actionFn: SetStateAction<any>) {
    this.subscribers.add(actionFn);
    return () => {
      this.subscribers.delete(actionFn);
    };
  }

  publish(errors: FormFieldsErrors) {
    for (const actionFn of Array.from(this.subscribers)) {
      actionFn(errors);
    }
  }
}

export default FormFieldsErrorsSubscriptions;
