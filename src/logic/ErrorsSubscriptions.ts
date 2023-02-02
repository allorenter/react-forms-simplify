import { FormErrors, TouchedFormFields } from '@/types/Form';
import { SetStateAction } from 'react';
import formatErrors from './formatErrors';

class ErrorsSubscriptions {
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

  publish(errors: FormErrors) {
    for (const actionFn of Array.from(this.subscribers)) {
      const formatted = formatErrors(errors);
      actionFn(formatted);
    }
  }

  getSubscribers() {
    return this.subscribers;
  }
}

export default ErrorsSubscriptions;
