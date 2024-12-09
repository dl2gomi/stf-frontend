import DashboardLayout from '@/components/layout/DashboardLayout';
import Market from '@/components/sections/Market';
import { forUser } from '@/helpers/permission';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Market />
    </DashboardLayout>
  );
};

export default forUser(Dashboard);
