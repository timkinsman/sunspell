import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <div className="flex-1 px-4 flex justify-start">
            <div className="flex items-center">
              <Heading>Sunspell</Heading>
            </div>
          </div>
          <div className="flex-1 px-4 flex justify-end">
            <div className="flex items-center">
              <UserNavigation />
            </div>
          </div>
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">{children}</main>
      </div>
    </div>
  );
};
