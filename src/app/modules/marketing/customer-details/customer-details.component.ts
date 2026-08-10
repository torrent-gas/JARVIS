import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { getCustomer } from '../../../data/existing-customers.data';
import { ContractsComponent } from "../../industrial-customer/contracts/contracts.component";

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ContractsComponent],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css'],
})
export class CustomerDetailsComponent {
  Math = Math;
  customer = getCustomer(this.route.snapshot.paramMap.get('id'));
  constructor(private route: ActivatedRoute) {
    console.log('hello')
  }
  get dcqUtilization() {
    return Math.round(
      (this.customer.currentConsumption / this.customer.dcq) * 100,
    );
  }
  get mdcqUtilization() {
    return Math.round((this.customer.peakDaily / this.customer.mdcq) * 100);
  }
  get unusedCapacity() {
    return this.customer.dcq - this.customer.currentConsumption;
  }
}
