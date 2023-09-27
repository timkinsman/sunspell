import { ContentLayout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-xl mt-2">
        Welcome <b>{user.display_name}</b>
      </h1>
    </ContentLayout>
  );
};
