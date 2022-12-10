import { TouchedFormFields } from '@/types/Form';
import { SetStateAction } from 'react';

class FormFieldsTouchedSubscriptions {
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

  publish(touchedFormFields: TouchedFormFields) {
    for (const actionFn of Array.from(this.subscribers)) {
      actionFn(touchedFormFields);
    }
  }
}

export default FormFieldsTouchedSubscriptions;
