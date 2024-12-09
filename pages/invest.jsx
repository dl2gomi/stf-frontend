import { InvestTab } from '@/components/dashtabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { forUser } from '@/helpers/permission';

const Invest = () => {
  return (
    <DashboardLayout>
      <InvestTab />
    </DashboardLayout>
  );
};

export default forUser(Invest);
