import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopMenu } from '../components/TopMenu/TopMenu';
import { logoutAction } from '../store/userActions';

export function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    logoutAction();
    navigate('/');
  }, []);
  return (
    <>
      <TopMenu />
      <h2>please wait..</h2>
    </>
  );
}
