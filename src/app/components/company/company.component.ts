import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company.model';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  public editForm: FormGroup
  public showEditForm: boolean

  public company: Company
  public companyId: number
  public tickets: Ticket[]

  constructor(private companyService: CompanyService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private ticketService: TicketService,
    private router: Router,
    private location: Location) {
    this.editForm = this.formBuilder.group({
      name: ["", [Validators.required]]
    })
  }

  ngOnInit(): void {

    if (localStorage.getItem('JWT') == undefined) {
      this.router.navigate(['/login']);
    }

    this.showEditForm = false;

    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = Number(params.get('id'))

      this.companyId = Number(params.get('id'))

      this.companyService.fetchById(this.companyId).subscribe(company => {
        console.log('Fetched company: ', company);
        this.company = company;

        this.editForm = this.formBuilder.group({
          name: [company.name, [Validators.required]]
        })

        this.ticketService.fetchCompanyTickets(this.company.id).subscribe(tickets => {
          this.tickets = tickets;
        })
      })
    })
  }

  openEditForm() {
    this.showEditForm = true;
  }

  delete() {
    this.companyService.deleteCompany(this.company.id);
    this.router.navigate(["/home"]);
  }

  submitEditForm(parameters) {
    console.log(parameters);

    const company: Company = {
      id: this.company.id,
      name: parameters.name
    }

    this.companyService.updateCompany(company).subscribe(company => {
      console.log('Updated company: ', company);
    })

    this.location.back()
  }

  public get name() {
    return this.editForm.get('name')
  }
}
