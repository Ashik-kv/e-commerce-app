import { useState, useEffect } from "react";

/**
 * Returns a debounced version of a value.
 * @param value The input value to debounce
 * @param delay Delay in ms (default: 500)
 */
export function useDebouncedValue(value, delay = 500) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounced(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debounced;
}