import { WithdrawTab } from '@/components/dashtabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { forOwnerOrCEO } from '@/helpers/permission';

const Withdraw = () => {
  return (
    <DashboardLayout>
      <WithdrawTab />
    </DashboardLayout>
  );
};

export default forOwnerOrCEO(Withdraw);
