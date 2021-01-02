import { Component, Input, OnInit } from '@angular/core';
import { Ticket } from 'src/app/models/ticket.model';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company/company.service';
import { Flight } from 'src/app/models/flight.model';
import { FlightService } from 'src/app/services/flight/flight.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {

  public editForm: FormGroup

  public ticketId: Number
  public ticket: Ticket
  public companies: Company[]
  public flights: Flight[]

  public isNewTicketOfReturnType: boolean


  constructor(private ticketService: TicketService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private flightService: FlightService,
    private router: Router,
    private location: Location
  ) {

    this.editForm = this.formBuilder.group({
      flightId: ["", [Validators.required]],
      companyId: ["", [Validators.required]],
      oneWay: ["", [Validators.required]],
      count: [null, [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
      departDate: ["", [Validators.required]],
      returnDate: [""]
    })
  }

  ngOnInit(): void {

    if (localStorage.getItem('JWT') == undefined) {
      this.router.navigate(['/login']);
    }

    this.isNewTicketOfReturnType = true;

    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = Number(params.get('id'))

      this.ticketId = Number(params.get('id'))

      this.ticketService.fetchTicketById(this.ticketId).subscribe(ticket => {
        console.log('Fetched ticket: ', ticket);
        this.ticket = ticket;

        this.editForm = this.formBuilder.group({
          flightId: [this.ticket.flightId, [Validators.required]],
          companyId: [this.ticket.companyId, [Validators.required]],
          oneWay: [this.ticket.oneWay ? 1 : 0, [Validators.required]],
          count: [this.ticket.count, [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
          departDate: [new Date(this.ticket.departDate).toISOString().substr(0, 23), [Validators.required]],
          returnDate: [this.ticket.returnDate != undefined ? new Date(this.ticket.returnDate).toISOString().substr(0, 23) : ""]
        })
      })
    })


    this.companyService.fetchCompanies().subscribe(companies => {
      this.companies = companies;
      console.log('Companies ', companies);
    })

    this.flightService.fetchFlights().subscribe(flights => {
      this.flights = flights;
      console.log('Flights ', flights);
    })
  }

  goBack() {
    this.location.back()
  }

  public submitForm(parameters) {

    if (parameters.oneWay.toString().match("1")) {
      parameters.returnDate = undefined;
    }

    const editTicket = {
      id: this.ticketId,
      companyId: parameters.companyId,
      companyName: "",
      oneWay: parameters.oneWay.toString().match("1") ? true : false,
      departDate: new Date(parameters.departDate).getTime(),
      returnDate: parameters.returnDate != undefined && parameters.returnDate != null ? new Date(parameters.returnDate).getTime() : null,
      flightId: parameters.flightId,
      count: parameters.count,
      reserved: 0
    }

    this.ticketService.updateTicket(editTicket).subscribe(ticket => {
      console.log("Updated ticket: ", ticket);
    });

    this.editForm.reset();
    this.router.navigate(['/home']);
  }

  public get username() {
    return this.editForm.get('username')
  }

  public get password() {
    return this.editForm.get('password')
  }

  public get flightId() {
    return this.editForm.get('flightId')
  }

  public get companyId() {
    return this.editForm.get('companyId')
  }

  public get oneWay() {
    return this.editForm.get('oneWay')
  }

  public get count() {
    return this.editForm.get('count')
  }

  public get departDate() {
    return this.editForm.get('departDate')
  }

  public get returnDate() {
    return this.editForm.get('returnDate')
  }

  hideOrShowReturnDate() {
    if (this.oneWay.value.toString().match("1")) {
      this.isNewTicketOfReturnType = false;
    } else {
      this.isNewTicketOfReturnType = true;
    }
  }

}
