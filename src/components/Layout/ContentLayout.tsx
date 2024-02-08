import * as React from 'react';

import { Head } from '../Head';
import { Link } from '@nayhoo/components';

const Footer = () => {
  return (
    <footer>
      <div className="w-full mx-auto max-w-7xl py-4 px-4 sm:px-6 md:px-8 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center">
          Developed by{' '}
          <Link href="https://github.com/timkinsman" target="_blank">
            Tim Kinsman
          </Link>
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
          <li>
            <Link href="https://github.com/timkinsman/sunspell" target="_blank">
              Source code
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

type ContentLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
      </div>
      <Footer />
    </>
  );
};
