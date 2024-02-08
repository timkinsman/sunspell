import * as React from 'react';

import logo from '@/assets/react.svg';
import { Head } from '@/components/Head';
import { Heading } from '@nayhoo/components';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Heading size="3" className="mt-3 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </Heading>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">{children}</div>
        </div>
      </div>
    </>
  );
};
