import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SidebarItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isMobile = false;
  isSidebarOpen = true;

  // Mock user data for the new profile footer
  currentUser = {
    name: 'Ramesh Kumar',
    crn: 'CRN-894321', // Customer Reference Number
    avatar: 'RK'
  };

  menuItems: SidebarItem[] = [
    { label: 'Connection Status', icon: 'ri-broadcast-line', route: '/industrial-customer/connection-status' },
    { label: 'Your Contracts', icon: 'ri-file-text-line', route: '/industrial-customer/contracts' },
    { label: 'Bills & Payments', icon: 'ri-bill-line', route: '/industrial-customer/billing-payments' },
    { label: 'Reports', icon: 'ri-file-text-line', route: '/industrial-customer/reports' },
    { label: 'Register Complaint', icon: 'ri-customer-service-2-line', route: '/industrial-customer/complaints' },
    { label: 'Tariff', icon: 'ri-money-rupee-circle-line', route: '/industrial-customer/tariff' }
  ];

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 992;
    if (this.isMobile) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}