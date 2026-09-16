import React from 'react';

function useMountEffect(fn) {
  const hasExecuted = React.useRef(false);

  React.useEffect(() => {
    if (!hasExecuted.current) {
      fn();

      hasExecuted.current = true;
    }
  }, [fn]);
}

export default useMountEffect;
