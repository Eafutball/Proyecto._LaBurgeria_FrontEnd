
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Hooks/useUser';

export function Logout() {
  const navigate = useNavigate();
  const { clearUser } = useUser();
  useEffect(() => {
    clearUser();
    return navigate('/login');
  }, []);
  return null;
}
