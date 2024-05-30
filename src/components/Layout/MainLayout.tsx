import * as React from 'react';

import { useAuth } from '@/hooks/useAuth';
import {
  Avatar,
  Box,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Flex,
  Separator,
} from '@nayhoo/components';
import { ThemeIconButton } from '@/features/theme/components/ThemeIconButton';

type UserNavigationItem = {
  name: string;
  to: string;
  onClick?: () => void;
};

const UserNavigation = () => {
  const { logout, user } = useAuth();

  const userNavigation = [
    {
      name: 'Your Profile',
      onClick: () => {
        window.open(user?.uri, '_blank');
      },
    },
    {
      name: 'Sign out',
      onClick: () => {
        logout();
      },
    },
  ].filter(Boolean) as UserNavigationItem[];

  const username = user?.display_name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          alt={`${username}'s Spotify profile picture`}
          fallback={username?.[0]}
          interactive
          size="3"
          src={user?.images[0].url}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent css={{ zIndex: '$1' }}>
        {userNavigation.map((item) => (
          <DropdownMenuItem key={item.name} onClick={item.onClick}>
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box css={{ height: '100vh' }}>
      <Flex direction="column" css={{ flex: '1 1 0%', minHeight: '100vh' }}>
        <nav style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <Flex css={{ p: '$2', backgroundColor: '$background' }}>
            <Flex css={{ flex: '1 1 0%' }} justify="start" align="center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21.192 4.221l-2.881 2.881c-.411-.528-.886-1.003-1.414-1.414l2.881-2.881 1.414 1.414zm-8.192-.152v-4.069h-2v4.069c.328-.041.661-.069 1-.069s.672.028 1 .069zm6.931 6.931c.041.328.069.661.069 1s-.028.672-.069 1h4.069v-2h-4.069zm-1.931 1c0 .341-.035.674-.09 1h-11.82c-.055-.326-.09-.659-.09-1 0-3.314 2.686-6 6-6s6 2.686 6 6zm-10.897-6.312l-2.881-2.881-1.414 1.414 2.881 2.881c.411-.529.885-1.003 1.414-1.414zm-7.103 5.312v2h4.069c-.041-.328-.069-.661-.069-1s.028-.672.069-1h-4.069zm9.062 11.667c-1.205-1.195-1.364-1.893-.312-3.26.37-.481.53-.942.53-1.4 0-.959-.699-1.906-1.623-3.006l-1.449 1.379c1.375 1.6 1.247 1.772.26 3.184-.316.453-.446.908-.446 1.355 0 1.159.876 2.259 1.665 3.082l1.375-1.334zm8.688 0c-1.205-1.195-1.364-1.893-.312-3.26.37-.481.529-.942.529-1.4 0-.959-.699-1.906-1.622-3.006l-1.448 1.379c1.375 1.6 1.246 1.772.26 3.184-.316.453-.446.908-.446 1.355 0 1.159.876 2.259 1.665 3.082l1.374-1.334zm-4.396 0c-1.205-1.195-1.364-1.893-.312-3.26.37-.481.529-.942.529-1.4 0-.959-.699-1.906-1.622-3.006l-1.448 1.379c1.375 1.6 1.246 1.772.26 3.184-.316.453-.446.908-.446 1.355 0 1.159.876 2.259 1.665 3.082l1.374-1.334z" />
              </svg>
            </Flex>
            <Flex css={{ flex: '1 1 0%' }} justify="end" align="center" gap="2">
              <ThemeIconButton />
              <UserNavigation />
            </Flex>
          </Flex>
          <Separator />
        </nav>

        <Flex as="main" css={{ flex: '1 1 0%', position: 'relative' }} direction="column">
          {children}
        </Flex>
      </Flex>
    </Box>
  );
};
