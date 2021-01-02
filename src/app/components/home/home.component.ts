import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket/ticket.service'
import { UserType } from 'src/app/models/userType.model';
import { UserTypeService } from 'src/app/services/userType/user-type.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company/company.service';
import { Flight } from 'src/app/models/flight.model';
import { FlightService } from 'src/app/services/flight/flight.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public searchForm: FormGroup
  public createUserForm: FormGroup
  public createTicketForm: FormGroup
  public createCompanyForm: FormGroup
  public createFlightForm: FormGroup

  public tickets: Ticket[]
  public filteredTickets: Ticket[]
  public chosenTicketType: String
  public userTypes: UserType[]
  public chosenUserTypeId: Number
  public companies: Company[]
  public flights: Flight[]

  public showCreateUserForm: boolean
  public showCreateTicketForm: boolean
  public showCreateCompanyForm: boolean
  public showCreateFlightForm: boolean

  public isNewTicketOfReturnType: boolean
  public isAdmin: boolean

  constructor(private ticketService: TicketService,
    private formBuilder: FormBuilder,
    private userTypeService: UserTypeService,
    private userService: UserService,
    private companyService: CompanyService,
    private flightService: FlightService,
    private router: Router
  ) {
    this.searchForm = this.formBuilder.group({
      from: [''],
      to: [''],
      departDate: [''],
      returnDate: [''],
      chosenTicketType: ['all']
    })

    this.createUserForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      userType: ["1", [Validators.required]]
    })

    this.createTicketForm = this.formBuilder.group({
      flightId: ["", [Validators.required]],
      companyId: ["", [Validators.required]],
      oneWay: ["", [Validators.required]],
      count: [null, [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
      departDate: ["", [Validators.required]],
      returnDate: [""]
    })

    this.createCompanyForm = this.formBuilder.group({
      companyName: ['', [Validators.required]]
    })

    this.createFlightForm = this.formBuilder.group({
      originCity: ['', [Validators.required]],
      destinationCity: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {

    if (localStorage.getItem('JWT') == undefined) {
      this.router.navigate(['/login']);
    }

    if (localStorage.getItem("userType").match("2") || localStorage.getItem("userType").match("3")) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    this.showCreateUserForm = false;
    this.showCreateTicketForm = false;
    this.showCreateCompanyForm = false;
    this.isNewTicketOfReturnType = false;

    this.ticketService.fetchTickets().subscribe(tickets => {
      console.log('Tickets: ', tickets);
      this.tickets = tickets;
      this.filteredTickets = tickets;
    })

    this.userTypeService.fetchUserTypes().subscribe(userTypes => {
      this.userTypes = userTypes;
      console.log(userTypes);
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

  submitCreateFlightForm(parameters) {
    console.log(parameters)

    if (parameters.originCity.toLowerCase().match(parameters.destinationCity.toLowerCase())) {
      alert("Flight origin city and destination city can't have same names!")
      return;
    }

    const flight: Flight = {
      id: 0,
      originCityId: 0,
      destinationCityId: 0,
      originCityName: parameters.originCity,
      destinationCityName: parameters.destinationCity,
    }

    this.flightService.addFlight(flight).subscribe(flight => {
      console.log('Created flight: ', flight);

      this.flightService.fetchFlights().subscribe(flights => {
        this.flights = flights;
        console.log('Flights ', flights);
      })

      this.createFlightForm.reset();
      this.showCreateFlightForm = false;
    }, error => {
      alert("Flight with this cities already exists!");
      return;
    })
  }

  hideOrShowReturnDate() {
    if (this.oneWay.value.toString().match("1")) {
      this.isNewTicketOfReturnType = false;
    } else {
      this.isNewTicketOfReturnType = true;
    }
  }

  openCreateUserForm() {
    this.showCreateUserForm = !this.showCreateUserForm;
  }

  openCreateTicketForm() {
    this.showCreateTicketForm = !this.showCreateTicketForm;
  }

  openCreateCompanyForm() {
    this.showCreateCompanyForm = !this.showCreateCompanyForm;
  }

  openCreateFlightForm() {
    this.showCreateFlightForm = !this.showCreateFlightForm;
  }

  public submitCreateCompanyForm(parameters) {

    const company: Company = {
      id: 0,
      name: parameters.companyName
    }

    this.companyService.addCompany(company).subscribe(company => {
      console.log('Created company: ', company);
      this.showCreateCompanyForm = false;
    }, error => {
      alert("Company with that name already exists. Try another one.")
    })

  }

  public submitCreateTicketForm(parameters) {

    if (parameters.returnDate != undefined) {
      if (new Date(parameters.departDate).getTime() > new Date(parameters.returnDate).getTime()) {
        alert("Depart date can't be before then return date.")
        return;
      }
    }

    const newTicket = {
      id: 0,
      companyId: parameters.companyId,
      companyName: "",
      oneWay: parameters.oneWay.toString().match("1") ? true : false,
      departDate: new Date(parameters.departDate).getTime(),
      returnDate: parameters.returnDate != undefined && parameters.returnDate != null ? new Date(parameters.returnDate).getTime() : null,
      flightId: parameters.flightId,
      count: parameters.count,
      reserved: 0
    }

    this.ticketService.addTicket(newTicket).subscribe(ticket => {
      console.log("Created ticket: ", ticket);

      this.ticketService.fetchTickets().subscribe(tickets => {
        console.log("After add: ", tickets);
        this.tickets = tickets;
        this.filteredTickets = tickets;
      })
    });

    this.createTicketForm.reset();
    this.showCreateTicketForm = false;
  }


  public submitCreateUserForm(parameters) {

    const newUser: User = {
      id: 0,
      username: parameters.username,
      password: parameters.password,
      userType: parameters.userType,
      jwt: ""
    }

    this.createUserForm.reset();
    this.userService.addUser(newUser).subscribe(users => {
      console.log(users);
      this.showCreateUserForm = false;
    }, error => {
      alert("User with that username already exists. Try another one.")
    })

  }

  public get username() {
    return this.createUserForm.get('username')
  }

  public get password() {
    return this.createUserForm.get('password')
  }

  public get flightId() {
    return this.createTicketForm.get('flightId')
  }

  public get companyId() {
    return this.createTicketForm.get('companyId')
  }

  public get oneWay() {
    return this.createTicketForm.get('oneWay')
  }

  public get count() {
    return this.createTicketForm.get('count')
  }

  public get departDate() {
    return this.createTicketForm.get('departDate')
  }

  public get returnDate() {
    return this.createTicketForm.get('returnDate')
  }

  public get companyName() {
    return this.createCompanyForm.get('companyName')
  }

  public get originCity() {
    return this.createFlightForm.get('originCity')
  }

  public get destinationCity() {
    return this.createFlightForm.get('destinationCity')
  }


  public submitForm(filterParameters) {
    this.filteredTickets = [];

    var type = filterParameters.chosenTicketType;
    var from = filterParameters.from;
    var to = filterParameters.to;
    var departDate = new Date(filterParameters.departDate).getTime();
    var returnDate = new Date(filterParameters.returnDate).getTime();

    for (let i = 0; i < this.tickets.length; i++) {
      var satisfiesFilter = true;

      if (type.match("oneWay")) {
        if (this.tickets[i].oneWay != 1) {
          satisfiesFilter = false;
        }
      }

      if (type.match("returnTicket")) {
        if (this.tickets[i].oneWay != 0) {
          satisfiesFilter = false;
        }
      }

      if (from != "") {
        if (!this.tickets[i].originCity.toLowerCase().match(from.toLowerCase())) {
          satisfiesFilter = false;
        }
      }

      if (to != "") {
        if (!this.tickets[i].destinationCity.toLowerCase().match(to.toLowerCase())) {
          satisfiesFilter = false;
        }
      }

      if (filterParameters.departDate != "" && filterParameters.returnDate != "") {
        if (this.tickets[i].departDate >= departDate && this.tickets[i].returnDate <= returnDate) {

        } else {
          satisfiesFilter = false;
        }
      }

      if (filterParameters.departDate != "") {
        if (this.tickets[i].departDate < departDate) {
          satisfiesFilter = false;
        }
      }

      if (filterParameters.returnDate != "") {
        if (this.tickets[i].returnDate > returnDate) {
          satisfiesFilter = false;
        }
      }


      if (satisfiesFilter) {
        this.filteredTickets.push(this.tickets[i]);
      }
    }
  }

}
