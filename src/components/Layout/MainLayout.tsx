import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

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
      to: '',
      onClick: () => {
        window.open(user?.uri, '_blank');
      },
    },
    {
      name: 'Sign out',
      to: '',
      onClick: () => {
        logout();
      },
    },
  ].filter(Boolean) as UserNavigationItem[];

  return (
    <Menu as="div" className="ml-3 relative">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="max-w-xs  bg-gray-200 p-2 flex items-center text-sm rounded-full focus:outline-none">
              <img className="rounded-full h-8 mr-2" src={user?.images[0].url} />
              {user?.display_name}
            </Menu.Button>
          </div>
          <Transition
            show={open}
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      onClick={item.onClick}
                      to={item.to}
                      className={clsx(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
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
              <h1 className="text-xl">Sunspell</h1>
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
