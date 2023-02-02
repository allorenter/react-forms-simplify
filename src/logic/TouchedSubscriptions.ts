import { TouchedNamesValues } from '@/types/Form';
import { SetStateAction } from 'react';

class TouchedSubscriptions {
  private subscribers: Set<SetStateAction<any>>;

  constructor() {
    this.subscribers = new Set<SetStateAction<TouchedNamesValues>>();
  }

  subscribe(actionFn: SetStateAction<any>) {
    this.subscribers.add(actionFn);
    return () => {
      this.subscribers.delete(actionFn);
    };
  }

  publish(touchedNamesValues: TouchedNamesValues) {
    for (const actionFn of Array.from(this.subscribers)) {
      actionFn(touchedNamesValues);
    }
  }

  getSubscribers() {
    return this.subscribers;
  }
}

export default TouchedSubscriptions;
