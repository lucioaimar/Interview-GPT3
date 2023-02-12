import { useUser } from '@auth0/nextjs-auth0/client';
import { Navbar, Avatar, Dropdown } from 'flowbite-react';
import { LoginButton } from './AuthButton';

export const Nav = () => {
  const { user, error, isLoading } = useUser();
  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  const handleSignOut = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand href="https://flowbite.com/">
        <img
          src="https://flowbite.com/docs/images/logo.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          InterviewGPT3
        </span>
      </Navbar.Brand>
      {user ? (
        <div className="flex">
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <Avatar
                alt="User settings"
                img={user.picture || ''}
                rounded={true}
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
      ) : (
        <LoginButton />
      )}
    </Navbar>
  );
};
