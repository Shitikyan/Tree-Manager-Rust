import { useEffect, useState } from 'react';
import isClient from '../utils/isClient';

/**
 * A custom React hook for tracking and updating window size.
 *
 * @param initialWidth - The initial width value (useful for server-side rendering).
 * @param initialHeight - The initial height value (useful for server-side rendering).
 *
 * @returns An object with the current width and height of the window.
 *
 * @example
 * const { width, height } = useWindowSize(1024, 768); // Initialize with default values
 *
 * // Usage:
 * <div>
 *   Window Width: {width}
 *   Window Height: {height}
 * </div>
 */

interface WindowSize {
  width: number;
  height: number;
}

function useWindowSize(
  initialWidth: number,
  initialHeight: number,
): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: isClient ? window.innerWidth : initialWidth,
    height: isClient ? window.innerHeight : initialHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}

export default useWindowSize;
