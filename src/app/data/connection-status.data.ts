export interface TrackingStep {
  id: number;
  title: string;
  status: 'completed' | 'active' | 'pending';
  icon: string;
  date?: string;
  remarks?: string;
}

export const CONNECTION_STATUS_DATA: TrackingStep[] = [
  {
    id: 1,
    title: 'Agreement Signed',
    status: 'completed',
    icon: 'ri-file-text-line',
    date: 'Aug 02, 2026 - 10:30 AM',
    remarks: 'Customer KYC verified and initial registration payment received successfully.'
  },
  {
    id: 2,
    title: 'Pipeline laid till your premises',
    status: 'completed',
    icon: 'ri-node-tree',
    date: 'Aug 04, 2026 - 02:15 PM',
    remarks: 'Underground MDPE network extended to the society boundary wall.'
  },
  {
    id: 3,
    title: 'Meter installed',
    status: 'active',
    icon: 'ri-dashboard-3-line',
    date: 'Aug 06, 2026 - 09:00 AM',
    remarks: 'Technician dispatched.'
  },
  {
    id: 4,
    title: 'PNG made available till meter',
    status: 'pending',
    icon: 'ri-drop-line'
  },
  {
    id: 5,
    title: 'TPI received',
    status: 'pending',
    icon: 'ri-shield-check-line'
  },
  {
    id: 6,
    title: 'PNG Commissioned successfully',
    status: 'pending',
    icon: 'ri-fire-fill'
  }
];