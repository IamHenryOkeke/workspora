import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Logout } from './logout';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-2xl font-bold">Workspora</h1>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-4">
          <SidebarMenuItem>Dashboard</SidebarMenuItem>
          <SidebarMenuItem>Settings</SidebarMenuItem>
          <SidebarMenuItem>
            <Logout />
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
