import React from 'react';
import { Button } from 'flowbite-react';

export const LogoutButton = () => (
  <Button color="purple" href="/api/auth/logout">
    Logout
  </Button>
);

export const LoginButton = () => (
  <Button color="purple" href="/api/auth/login">
    Login
  </Button>
);
