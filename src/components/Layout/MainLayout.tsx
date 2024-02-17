import * as React from 'react';

import { useAuth } from '@/hooks/useAuth';
import {
  Avatar,
  Box,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Flex,
  Heading,
  Text,
} from '@nayhoo/components';

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
        <Button variant="outline">
          <Avatar
            alt={`${username}'s Spotify profile picture`}
            css={{ mr: '$2' }}
            fallback={username?.[0]}
            size="2"
            src={user?.images[0].url}
          />
          <Text>{username}</Text>
        </Button>
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
    <Box css={{ height: '100vh', backgroundColor: 'rgb(243 244 246)' }}>
      <Flex direction="column" css={{ flex: '1 1 0%', minHeight: '100vh' }}>
        <Flex as="nav" css={{ backgroundColor: '#ffffff', zIndex: '$1', height: '$8' }}>
          <Flex css={{ flex: '1 1 0%', px: '$4' }} justify="start" align="center">
            <Heading>Sunspell</Heading>
          </Flex>
          <Flex css={{ flex: '1 1 0%', px: '$4' }} justify="end" align="center">
            <UserNavigation />
          </Flex>
        </Flex>

        <Flex as="main" css={{ flex: '1 1 0%', position: 'relative' }} direction="column">
          {children}
        </Flex>
      </Flex>
    </Box>
  );
};
