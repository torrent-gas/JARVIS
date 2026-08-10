import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NAVIGATION_CONFIG, NavItem } from '../../../../config/nav-config';

@Component({
  selector: 'app-login-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css']
})
export class LoginMenuComponent {
  menuConfig: NavItem[] = NAVIGATION_CONFIG;
  
  // Holds the currently selected parent to display its children
  selectedParent: NavItem | null = null;

  selectParent(parent: NavItem): void {
    if (parent.children && parent.children.length > 0) {
      this.selectedParent = parent;
    }
  }

  goBack(): void {
    this.selectedParent = null;
  }
}