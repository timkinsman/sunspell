import * as React from 'react';

import { Head } from '../Head';

const Footer = () => {
  return (
    <footer className="">
      <div className="w-full mx-auto max-w-7xl py-4 px-4 sm:px-6 md:px-8 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center">
          Developed by{' '}
          <a href="https://github.com/timkinsman" className="hover:underline">
            Tim Kinsman
          </a>
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
          <li>
            <a href="https://github.com/timkinsman/sunspell" className="hover:underline">
              Source code
            </a>
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
