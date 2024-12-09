import { AdminsTab } from '@/components/dashtabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { forOwnerOrCEO } from '@/helpers/permission';

const ManageAdmins = () => {
  return (
    <DashboardLayout>
      <AdminsTab />
    </DashboardLayout>
  );
};

export default forOwnerOrCEO(ManageAdmins);
