import { SettingsTab } from '@/components/dashtabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { forOwnerOrCEO } from '@/helpers/permission';

const Settings = () => {
  return (
    <DashboardLayout>
      <SettingsTab />
    </DashboardLayout>
  );
};

export default forOwnerOrCEO(Settings);
