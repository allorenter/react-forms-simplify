import { describe, test, expect } from 'vitest';
import FormValuesSubscriptions from './FormValuesSubscriptions';

describe('FormValuesSubscriptions tests', () => {
  test('should init subscription to value', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    subscriptions.initFormValueSubscription('cod');

    const formValuesSubscriptions = subscriptions.getAllSubscriptions();

    expect(formValuesSubscriptions.name).toBeDefined();
    expect(formValuesSubscriptions.cod).toBeDefined();
  });

  test('should return null if initFormValueSubscription is called and the FormValue has already been initialized', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    const result = subscriptions.initFormValueSubscription('name');
    expect(result).toBe(null);
  });

  test('should only init subcription once', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    subscriptions.subscribe('name', (val: any) => val);
    subscriptions.initFormValueSubscription('name');
    // en la subscripción tiene que haber un subscriber
    const sub = subscriptions.getFormValueSubscription('name');
    const subscribers = sub.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should subscribe to FormValue', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    subscriptions.subscribe('name', (val: any) => val);
    const sub = subscriptions.getFormValueSubscription('name');
    const subscribers = sub.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should not subscribe the same action more than once', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    const action = (val: any) => {
      return val;
    };
    subscriptions.subscribe('name', action);
    subscriptions.subscribe('name', action);
    const sub = subscriptions.getFormValueSubscription('name');
    const subscribers = sub.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should not subscribe the same action more than once', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    const action = (val: any) => {
      return val;
    };
    subscriptions.subscribe('name', action);
    subscriptions.subscribe('name', action);
    const sub = subscriptions.getFormValueSubscription('name');
    const subscribers = sub?.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should notify to subscribers on publish', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    // se puede hacer con un spy
    let counter = 0;
    const action1 = () => {
      counter += 1;
    };
    const action2 = () => {
      counter += 1;
    };
    subscriptions.subscribe('name', action1);
    subscriptions.subscribe('name', action2);
    subscriptions.publish('name', 'test the publish fn');
    expect(counter).toBe(2);
  });

  test('should publish the correct value to the subscribers', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    // se puede hacer con un spy
    let receivedValue;
    const action = (val: any) => {
      receivedValue = val;
    };
    subscriptions.subscribe('name', action);
    subscriptions.publish('name', 'test the publish fn');
    expect(receivedValue).toBe('test the publish fn');
  });

  test('should receive name and value in the action for subscribeAll', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    subscriptions.initFormValueSubscription('cod');
    const actionCalls: any = [];
    const action = (name: string, value: any) => {
      actionCalls.push({ name, value });
    };
    subscriptions.subscribeAll(action);
    subscriptions.publish('name', 'nameValue');
    subscriptions.publish('cod', 'codValue');
    expect(actionCalls).toEqual([
      { name: 'name', value: 'nameValue' },
      { name: 'cod', value: 'codValue' },
    ]);
  });

  test('should receive name and value in the action for subscribeAll', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    subscriptions.initFormValueSubscription('cod');
    const actionCalls: any = [];
    const action = (name: string, value: any) => {
      actionCalls.push({ name, value });
    };
    subscriptions.subscribeAll(action);
    subscriptions.publish('name', 'nameValue');
    subscriptions.publish('cod', 'codValue');
    expect(actionCalls).toEqual([
      { name: 'name', value: 'nameValue' },
      { name: 'cod', value: 'codValue' },
    ]);
  });

  test('should return null if subscribe is called before initializing FormValuesSubscription', async () => {
    const subscriptions = new FormValuesSubscriptions();
    const result = subscriptions.publish('name', 'test');
    expect(result).toBe(null);
  });

  test('should return null if publish is called before initializing FormValuesSubscription', async () => {
    const subscriptions = new FormValuesSubscriptions();
    const result = subscriptions.publish('name', 'test');
    expect(result).toBe(null);
  });

  test('should return null if publish is called before initializing FormValuesSubscription', async () => {
    const subscriptions = new FormValuesSubscriptions();
    const result = subscriptions.publish('name', 'test');
    expect(result).toBe(null);
  });

  test('should return null if subscribeAll is called and there is no initialized any FormValuesSubscription', async () => {
    const subscriptions = new FormValuesSubscriptions();
    const result = subscriptions.subscribeAll(() => {});
    expect(result).toBe(null);
  });
});
