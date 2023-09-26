import { ContentLayout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';

export const Dashboard = () => {
  const auth = useAuth();

  if (!auth.user) {
    return;
  }

  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-xl mt-2">
        Welcome <b>{auth.user.display_name}</b>
      </h1>
    </ContentLayout>
  );
};
