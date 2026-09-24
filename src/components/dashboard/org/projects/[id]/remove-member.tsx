import { Button } from '@/components/ui/button';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';

export default function RemoveMember({ id }: { id: string }) {
  const canManage = useCanManageOrganization();
  console.log(id);
  return canManage ? <Button variant="ghost">Remove</Button> : null;
}
