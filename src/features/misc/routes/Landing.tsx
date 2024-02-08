import { Head } from '@/components/Head';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@nayhoo/components';

export const Landing = () => {
  const { isLoggingIn, user } = useAuth();

  const handleStart = () => {
    if (user) {
      window.location.assign('/app');
    } else {
      window.location.assign('/auth/login');
    }
  };

  return (
    <>
      <Head description={`Welcome to sunspell`} />
      <div className="bg-white h-[100vh] flex items-center">
        <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">sunspell</span>
          </h2>

          <p className="mt-4"></p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Button onClick={handleStart} loading={isLoggingIn}>
                {user ? `Continue as ${user.display_name}` : 'Get started'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
