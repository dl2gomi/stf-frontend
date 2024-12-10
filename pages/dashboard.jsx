import { UserDashboard } from '@/components/dashtabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { forUser } from '@/helpers/permission';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <UserDashboard />
    </DashboardLayout>
  );
};

export default forUser(Dashboard);
