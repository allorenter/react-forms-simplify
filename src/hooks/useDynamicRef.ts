import { createRef } from 'react';

const map = new Map<string, React.RefObject<unknown>>();

function setRef<T>(key: string): React.RefObject<T> | void {
  if (!key) return console.warn(`useDynamicRefs: Cannot set ref without key `);
  const ref = createRef<T>();
  map.set(key, ref);
  return ref;
}

function getRef<T>(key: string): React.RefObject<T> | undefined | void {
  if (!key) return console.warn(`useDynamicRefs: Cannot get ref without key`);
  return map.get(key) as React.RefObject<T>;
}

function getAllRefs<T>(): Map<string, React.RefObject<unknown>> {
  return map;
}

function useDynamicRefs<T>(): [
  (key: string) => void | React.RefObject<T>,
  (key: string) => void | React.RefObject<T>,
  () => void | Map<string, React.RefObject<unknown>>,
] {
  return [getRef, setRef, getAllRefs];
}

export default useDynamicRefs;
