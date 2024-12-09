import { UsersTab } from '@/components/dashtabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { forOwnerOrCEO } from '@/helpers/permission';

const ManageUsers = () => {
  return (
    <DashboardLayout>
      <UsersTab />
    </DashboardLayout>
  );
};

export default forOwnerOrCEO(ManageUsers);
