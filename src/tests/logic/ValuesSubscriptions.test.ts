import { describe, test, expect } from 'vitest';
import ValuesSubscriptions from '../../logic/ValuesSubscriptions';

describe('ValuesSubscriptions tests', () => {
  test('should init subscription to value', async () => {
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    subscriptions.initValueSubscription('cod');

    const valuesSubscriptions = subscriptions.getAllSubscriptions();

    expect(valuesSubscriptions.name).toBeDefined();
    expect(valuesSubscriptions.cod).toBeDefined();
  });

  test('should return null if initValueSubscription is called and the Value has already been initialized', async () => {
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    const result = subscriptions.initValueSubscription('name');
    expect(result).toBe(null);
  });

  test('should only init ValueSubscription once', async () => {
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    subscriptions.subscribe('name', (val: any) => val);
    subscriptions.initValueSubscription('name');
    // en la subscripción tiene que haber un subscriber
    const sub = subscriptions.getValueSubscription('name');
    const subscribers = sub.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should subscribe to Value', async () => {
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    subscriptions.subscribe('name', (val: any) => val);
    const sub = subscriptions.getValueSubscription('name');
    const subscribers = sub.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should not subscribe the same action more than once', async () => {
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    const action = (val: any) => {
      return val;
    };
    subscriptions.subscribe('name', action);
    subscriptions.subscribe('name', action);
    const sub = subscriptions.getValueSubscription('name');
    const subscribers = sub.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should not subscribe the same action more than once', async () => {
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    const action = (val: any) => {
      return val;
    };
    subscriptions.subscribe('name', action);
    subscriptions.subscribe('name', action);
    const sub = subscriptions.getValueSubscription('name');
    const subscribers = sub?.getSubscribers();
    expect(subscribers.size).toBe(1);
  });

  test('should notify to subscribers on publish', async () => {
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
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
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
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
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    subscriptions.initValueSubscription('cod');
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
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    subscriptions.initValueSubscription('cod');
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

  test('should return null if subscribe is called before initializing ValuesSubscription', async () => {
    const subscriptions = new ValuesSubscriptions();
    const result = subscriptions.publish('name', 'test');
    expect(result).toBe(null);
  });

  test('should return null if publish is called before initializing ValuesSubscription', async () => {
    const subscriptions = new ValuesSubscriptions();
    const result = subscriptions.publish('name', 'test');
    expect(result).toBe(null);
  });

  test('should return null if publish is called before initializing ValuesSubscription', async () => {
    const subscriptions = new ValuesSubscriptions();
    const result = subscriptions.publish('name', 'test');
    expect(result).toBe(null);
  });

  test('should return null if subscribeAll is called and there is no initialized any ValuesSubscription', async () => {
    const subscriptions = new ValuesSubscriptions();
    const result = subscriptions.subscribeAll((val: any) => val);
    expect(result).toBe(null);
  });

  test('should unsubscribe the action', async () => {
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    const subscribedAction = subscriptions.subscribe('name', (val: any) => val);

    expect(subscriptions.getValueSubscription('name').getSubscribers().size).toBe(1);

    subscribedAction?.();

    expect(subscriptions.getValueSubscription('name').getSubscribers().size).toBe(0);
  });
});
