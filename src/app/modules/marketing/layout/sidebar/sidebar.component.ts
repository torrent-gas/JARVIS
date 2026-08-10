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
    name: 'Vinesh',
    avatar: 'VV'
  };

  menuItems: SidebarItem[] = [
    { label: 'Pipeline Route Feasibility', icon: 'ri-broadcast-line', route: '/marketing/feasibility-check' },
    { label: 'Existing Customers', icon: 'ri-file-text-line', route: '/marketing/existing-customers' },
    { label: 'Bills, Payments and Exposure', icon: 'ri-bill-line', route: '/marketing/billing-payments' },
    { label: 'Tariff and Price Revision', icon: 'ri-money-rupee-circle-line', route: '/marketing/tariff' },
    { label: 'Registered Complaints', icon: 'ri-customer-service-2-line', route: '/marketing/complaints' },
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
