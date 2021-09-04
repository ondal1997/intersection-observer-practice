import { useCallback, useRef, useState } from 'react';

const usePromiseExecutor = () => {
  const promiseRef = useRef(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const execute = useCallback((promise, onFullfilled, onRejected) => {
    promiseRef.current = promise;
    setIsExecuting(true);

    promise.then(
      (res) => {
        if (promiseRef.current !== promise) return;
        onFullfilled(res);
        stop();
      },
      (err) => {
        if (promiseRef.current !== promise) return;
        onRejected(err);
        stop();
      }
    );
  }, []);

  const stop = useCallback(() => {
    promiseRef.current = null;
    setIsExecuting(false);
  }, []);

  const promiseExecutor = { execute, stop };
  return [promiseExecutor, isExecuting];
};

export default usePromiseExecutor;
