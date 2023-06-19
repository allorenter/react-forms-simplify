import { describe, test, expect } from 'vitest';
import FormNameSubscriptions from '@/logic/FormNameSubscriptions';

describe('FormNameSubscriptions tests', () => {
  test('should init subscription', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    subscriptions.initSubscription('cod');

    const valuesSubscriptions = subscriptions.getAllSubscriptions();

    expect(valuesSubscriptions.name).toBeDefined();
    expect(valuesSubscriptions.cod).toBeDefined();
  });

  test('should return null if initSubscription is called and the FormName has already been initialized', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    const result = subscriptions.initSubscription('name');
    expect(result).toBe(null);
  });

  test('should only init subscription once', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    subscriptions.subscribe('name', (val: any) => val);
    subscriptions.initSubscription('name');
    // en la subscripción tiene que haber un subscriber
    const sub = subscriptions.getSubscription('name');
    const subscribers = sub.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should subscribe', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    subscriptions.subscribe('name', (val: any) => val);
    const sub = subscriptions.getSubscription('name');
    const subscribers = sub.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should not subscribe the same action more than once', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    const action = (val: any) => {
      return val;
    };
    subscriptions.subscribe('name', action);
    subscriptions.subscribe('name', action);
    const sub = subscriptions.getSubscription('name');
    const subscribers = sub.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should not subscribe the same action more than once', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    const action = (val: any) => {
      return val;
    };
    subscriptions.subscribe('name', action);
    subscriptions.subscribe('name', action);
    const sub = subscriptions.getSubscription('name');
    const subscribers = sub?.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should notify to subscribers on publish', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
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
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
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
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    subscriptions.initSubscription('cod');
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
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    subscriptions.initSubscription('cod');
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

  test('should return null if subscribe is called before initializing', async () => {
    const subscriptions = new FormNameSubscriptions();
    const result = subscriptions.subscribe('name', () => {});
    expect(result).toBe(null);
  });

  test('should return null if publish is called before initializing', async () => {
    const subscriptions = new FormNameSubscriptions();
    const result = subscriptions.publish('name', 'test');
    expect(result).toBe(null);
  });

  test('should return null if subscribeAll is called and there is no initialized any', async () => {
    const subscriptions = new FormNameSubscriptions();
    const result = subscriptions.subscribeAll((val: any) => val);
    expect(result).toBe(null);
  });

  test('should unsubscribe the action', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    const subscribedAction = subscriptions.subscribe('name', (val: any) => val);

    expect(subscriptions.getSubscription('name').getSubscribers().size).toBe(1);

    subscribedAction?.();

    expect(subscriptions.getSubscription('name').getSubscribers().size).toBe(0);
  });

  test('should unsubscribe all the actions subscribed previously when call the return function of subscribeAll', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    subscriptions.initSubscription('name1');
    const subscribedAction = subscriptions.subscribeAll((val: any) => val);

    expect(subscriptions.getSubscription('name').getSubscribers().size).toBe(1);
    expect(subscriptions.getSubscription('name1').getSubscribers().size).toBe(1);

    subscribedAction?.();

    expect(subscriptions.getSubscription('name').getSubscribers().size).toBe(0);
    expect(subscriptions.getSubscription('name1').getSubscribers().size).toBe(0);
  });
});
