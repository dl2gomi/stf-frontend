import { RewardsTab } from '@/components/dashtabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { forUser } from '@/helpers/permission';

const Rewards = () => {
  return (
    <DashboardLayout>
      <RewardsTab />
    </DashboardLayout>
  );
};

export default forUser(Rewards);
