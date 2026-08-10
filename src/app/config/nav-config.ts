export interface NavItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  route?: string;
  children?: NavItem[];
}

export const NAVIGATION_CONFIG: NavItem[] = [
  {
    id: 'customer',
    label: 'Customer Login',
    description: 'Portal for our partners and consumers',
    icon: 'ri-user-smile-line',
    children: [
      { id: 'industrial', label: 'Industrial Customer', icon: 'ri-building-3-line', route: '/industrial-customer' },
      { id: 'commercial', label: 'Commercial Customer', icon: 'ri-store-2-line', route: '/login/commercial' }
    ]
  },
  {
    id: 'corporate',
    label: 'Corporate Login',
    description: 'Internal access for staff and management',
    icon: 'ri-building-4-line',
    children: [
      { id: 'marketing', label: 'Marketing', icon: 'ri-bar-chart-box-line', route: '/marketing' },
      { id: 'projects', label: 'Projects', icon: 'ri-projector-line', route: '/login/projects' },
      { id: 'oandm', label: 'O&M', icon: 'ri-tools-line', route: '/login/o-and-m' },
      { id: 'material', label: 'Material Management', icon: 'ri-truck-line', route: '/login/material-management' }
    ]
  }
];