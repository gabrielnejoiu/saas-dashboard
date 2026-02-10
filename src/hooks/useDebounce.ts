import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing a value
 * Useful for search inputs to avoid making API calls on every keystroke
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 300ms)
 * @returns The debounced value
 *
 * @example
 * const [search, setSearch] = useState("");
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   // This will only run 300ms after the user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
