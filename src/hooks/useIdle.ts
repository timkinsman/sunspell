import { useEffect, useRef, useState } from 'react';

/**
 * @author https://learnersbucket.com/examples/interview/useidle-hook-in-react/
 */
export const useIdle = (delay = 2000) => {
  const [isIdle, setIsIdle] = useState(false);

  // create a new reference to track timer
  const timeoutId = useRef<NodeJS.Timeout | undefined>();

  // assign and remove the listeners
  useEffect(() => {
    setup();

    return () => {
      cleanUp();
    };
  });

  const startTimer = () => {
    // wait till delay time before calling goInactive
    timeoutId.current = setTimeout(goInactive, delay);
  };

  const resetTimer = () => {
    // reset the timer and make user active
    clearTimeout(timeoutId.current);
    goActive();
  };

  const goInactive = () => {
    setIsIdle(true);
  };

  const goActive = () => {
    setIsIdle(false);

    // start the timer to track Inactiveness
    startTimer();
  };

  const setup = () => {
    document.addEventListener('mousemove', resetTimer, false);
    document.addEventListener('mousedown', resetTimer, false);
    document.addEventListener('keypress', resetTimer, false);
    document.addEventListener('DOMMouseScroll', resetTimer, false);
    document.addEventListener('mousewheel', resetTimer, false);
    document.addEventListener('touchmove', resetTimer, false);
    document.addEventListener('MSPointerMove', resetTimer, false);

    // edge case
    // if tab is changed or is out of focus
    window.addEventListener('blur', startTimer, false);
    window.addEventListener('focus', resetTimer, false);
  };

  const cleanUp = () => {
    document.removeEventListener('mousemove', resetTimer);
    document.removeEventListener('mousedown', resetTimer);
    document.removeEventListener('keypress', resetTimer);
    document.removeEventListener('DOMMouseScroll', resetTimer);
    document.removeEventListener('mousewheel', resetTimer);
    document.removeEventListener('touchmove', resetTimer);
    document.removeEventListener('MSPointerMove', resetTimer);

    // edge case
    // if tab is changed or is out of focus
    window.removeEventListener('blur', startTimer);
    window.removeEventListener('focus', resetTimer);

    // memory leak
    clearTimeout(timeoutId.current);
  };

  // return previous value (happens before update in useEffect above)
  return isIdle;
};
