import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ContractDetails {
  companyInfo: {
    companyName: string;
    companyAddress: string;
    registeredMail: string;
    registeredPhone: string;
    agreementDate: string;
    commissionedDate: string;
  };
  contractTerms: {
    customerId: string;
    category: string;
    contractType: string;
    mgoObligation: string;
    dcq: string;
    mdcq: string;
    mgo: string;
    excessLimit: string;
    excessLimitCriteria: string;
    status: string;
    meterType: string;
    deliveryPressure: string;
    maximumAllowableFlowRate: string;
  };
}

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
})
export class ContractsComponent implements OnInit {
  contractData!: ContractDetails;

  ngOnInit(): void {
    // Static / Read-Only mock data payload
    this.contractData = {
      companyInfo: {
        companyName: 'Wheels India',
        companyAddress:
          'MTH Road, Padi, Chennai, Tamil Nadu, India - 600050',
        registeredMail: 'operations@wheelsindia.in',
        registeredPhone: '+91 99740 05581',
        agreementDate: '17 Jan 2025',
        commissionedDate: '27 Jun 2025',
      },
      contractTerms: {
        customerId: '1000327488',
        category: 'Industrial',
        contractType: 'MGO + Non-MGO',
        mgoObligation: 'Monthly',
        dcq: '300 MMBTU',
        mdcq: '500 MMBTU',
        mgo: '90%',
        excessLimit: '20%',
        excessLimitCriteria: 'Daily',
        status: 'Active',
        meterType: 'G100 RPD',
        deliveryPressure: '1.5 bar(g)',
        maximumAllowableFlowRate: '368 SCMH',
      },
    };
  }

  downloadContractPdf(): void {
    // Action handler for document export
    console.log('Exporting contract summary PDF...');
  }
}
