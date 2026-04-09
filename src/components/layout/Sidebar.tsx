import { Home, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const sidebarItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("hidden lg:flex h-full w-72 flex-col border-r bg-muted/30", className)}>
      <div className="p-6">
        {/* Logo in Sidebar */}
        <div className="flex items-center gap-3 mb-10">
          <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
            ES
          </div>
          <div>
            <div className="font-bold text-2xl tracking-tight">Elite Status</div>
            <div className="text-xs text-muted-foreground">Admin Panel</div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-base font-medium hover:bg-accent"
                asChild
              >
                <a href={item.href}>
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </a>
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Logout at bottom */}
      <div className="mt-auto p-6 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10">
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}