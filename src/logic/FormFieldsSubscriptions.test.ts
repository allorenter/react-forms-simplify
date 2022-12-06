import { describe, test, expect } from 'vitest';
import FormFieldsSubscriptions from './FormFieldsSubscriptions';

describe('FormFieldsSubscriptions tests', () => {
  test('should init subscription to value', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    subscriptions.initFormFieldSubscription('cod');

    const formFieldsSubscriptions = subscriptions.getAllSubscriptions();

    expect(formFieldsSubscriptions.name).toBeDefined();
    expect(formFieldsSubscriptions.cod).toBeDefined();
  });

  test('should return null if initFormFieldSubscription is called and the FormField has already been initialized', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    const result = subscriptions.initFormFieldSubscription('name');
    expect(result).toBe(null);
  });

  test('should only init FormFieldSubscription once', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    subscriptions.subscribe('name', (val: any) => val);
    subscriptions.initFormFieldSubscription('name');
    // en la subscripción tiene que haber un subscriber
    const sub = subscriptions.getFormFieldSubscription('name');
    const subscribers = sub.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should subscribe to FormField', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    subscriptions.subscribe('name', (val: any) => val);
    const sub = subscriptions.getFormFieldSubscription('name');
    const subscribers = sub.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should not subscribe the same action more than once', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    const action = (val: any) => {
      return val;
    };
    subscriptions.subscribe('name', action);
    subscriptions.subscribe('name', action);
    const sub = subscriptions.getFormFieldSubscription('name');
    const subscribers = sub.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should not subscribe the same action more than once', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    const action = (val: any) => {
      return val;
    };
    subscriptions.subscribe('name', action);
    subscriptions.subscribe('name', action);
    const sub = subscriptions.getFormFieldSubscription('name');
    const subscribers = sub?.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should notify to subscribers on publish', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
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
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
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
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    subscriptions.initFormFieldSubscription('cod');
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
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    subscriptions.initFormFieldSubscription('cod');
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

  test('should return null if subscribe is called before initializing FormFieldsSubscription', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    const result = subscriptions.publish('name', 'test');
    expect(result).toBe(null);
  });

  test('should return null if publish is called before initializing FormFieldsSubscription', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    const result = subscriptions.publish('name', 'test');
    expect(result).toBe(null);
  });

  test('should return null if publish is called before initializing FormFieldsSubscription', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    const result = subscriptions.publish('name', 'test');
    expect(result).toBe(null);
  });

  test('should return null if subscribeAll is called and there is no initialized any FormFieldsSubscription', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    const result = subscriptions.subscribeAll((val: any) => val);
    expect(result).toBe(null);
  });

  test('should unsubscribe the action', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    const subscribedAction = subscriptions.subscribe('name', (val: any) => val);

    expect(subscriptions.getFormFieldSubscription('name').getSubscribers().size).toBe(1);

    subscribedAction?.();

    expect(subscriptions.getFormFieldSubscription('name').getSubscribers().size).toBe(0);
  });
});
