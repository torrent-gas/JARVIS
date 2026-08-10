import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CONNECTION_STATUS_DATA, TrackingStep } from '../../../data/connection-status.data';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.css']
})
export class ConnectionStatusComponent implements OnInit {
  trackingSteps: TrackingStep[] = [];

  ngOnInit(): void {
    // Simulating loading data from a JSON file/API
    this.trackingSteps = CONNECTION_STATUS_DATA;
  }
}