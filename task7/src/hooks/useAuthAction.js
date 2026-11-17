import { useCallback, useState } from 'react';
import { authErrorMessage } from '../services/authService.js';

// Runs an auth action and tracks its loading + error state for a form.
export function useAuthAction() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const run = useCallback(async (action) => {
    setPending(true);
    setError('');
    try {
      await action();
      return true;
    } catch (err) {
      setError(authErrorMessage(err));
      return false;
    } finally {
      setPending(false);
    }
  }, []);

  return { pending, error, setError, run };
}
