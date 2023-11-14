import { useState } from 'react';

/**
 * A custom React hook for managing state with local storage persistence.
 *
 * @param key - The key to use for storing the value in local storage.
 * @param initialValue - The initial value to use when no stored value is found.
 *
 * @returns A tuple containing the stored value and a function to update it.
 *
 * @example
 * const [count, setCount] = useLocalStorage('count', 0); // Initialize with a default value
 *
 * // Usage:
 * <div>
 *   Count: {count}
 *   <button onClick={() => setCount(count + 1)}>Increment</button>
 * </div>
 */

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const storedValue = localStorage.getItem(key);
  const [value, setValue] = useState<T>(
    storedValue ? JSON.parse(storedValue) : initialValue,
  );

  const updateValue: SetValue<T> = (newValue) => {
    const valueToStore =
      newValue instanceof Function ? newValue(value) : newValue;
    setValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [value, updateValue];
}

export default useLocalStorage;
