import FormValuesSubscriptions from '@/logic/FormValuesSubscriptions';
import { useEffect, useMemo, useState } from 'react';

function useFormHistory({
  formValuesSubscriptions,
}: {
  formValuesSubscriptions: FormValuesSubscriptions;
}) {
  const [lastState, setLastState] = useState();
  const [history, setHistory] = useState([]);
  const [historyPosition, setHistoryPosition] = useState();

  useEffect(() => {
    setHistory((prev) => {
      return [...prev, lastState];
    });
  }, [lastState]);

  const actionFn = (name, value) => {
    setLastState((prev: any) => {
      const newState = { ...prev };
      newState[name] = value;
      return newState;
    });
  };

  useEffect(() => {
    formValuesSubscriptions.addGlobalSubscriber(actionFn);
  }, [formValuesSubscriptions]);

  return { history, lastState };
}

export default useFormHistory;
