import { ProfitShareTab } from '@/components/dashtabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { forAdmin } from '@/helpers/permission';

const ProfitShare = () => {
  return (
    <DashboardLayout>
      <ProfitShareTab />
    </DashboardLayout>
  );
};

export default forAdmin(ProfitShare);
