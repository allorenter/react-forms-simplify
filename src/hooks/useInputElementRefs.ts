import { createRef } from 'react';

const map = new Map<string, React.RefObject<unknown>>();

function setRef<T>(key: string): React.RefObject<T> | void {
  if (!key) return console.warn(`useInputElementRefs: Cannot set ref without key `);

  const refExists = map.get(key) as React.RefObject<T>;
  if (typeof refExists?.current === 'object' && refExists?.current !== null) {
    return refExists;
  }

  const ref = createRef<T>();
  map.set(key, ref);
  return ref;
}

function getRef<T>(key: string): React.RefObject<T> | undefined | void {
  if (!key) return console.warn(`useInputElementRefs: Cannot get ref without key`);
  return map.get(key) as React.RefObject<T>;
}

function getAllRefs() {
  return map;
}

function useInputElementRefs<T>(): [
  (key: string) => void | React.RefObject<T>,
  (key: string) => void | React.RefObject<T>,
  () => Map<string, React.RefObject<unknown>>,
] {
  return [getRef, setRef, getAllRefs];
}

export default useInputElementRefs;
