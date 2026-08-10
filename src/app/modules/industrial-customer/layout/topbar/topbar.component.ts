import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  // Hardcoded for prototype; normally fetched from an Auth/User Service
  customerId = 'TG-IND-894321';
  
  currentUser = {
    name: 'Ramesh Kumar',
    crn: 'CRN-894321', 
    avatar: 'RK'
  };
}