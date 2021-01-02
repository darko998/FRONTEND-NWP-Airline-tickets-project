import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service'
import { Reservation } from 'src/app/models/reservation.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {

  public reserveTicketsForm: FormGroup

  @Input() isAdmin: boolean
  @Input() tickets: Ticket[];
  public reservations: Reservation[]
  applied = [] as boolean[];

  constructor(private reservationService: ReservationService,
    private ticketService: TicketService,
    private router: Router,
    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {

    if (localStorage.getItem('JWT') == undefined) {
      this.router.navigate(['/login']);
    }

    this.reserveTicketsForm = this.formBuilder.group({
      numberOfTickets: ['1']
    })

    this.reservationService.fetchReservations().subscribe(reservations => {
      console.log('Reservations changed: ', reservations);
      this.reservations = reservations;

      this.refreshAppliedTickets();

      //this.countReservedTickets();
    })
  }

  public get numberOfTickets() {
    return this.reserveTicketsForm.get('numberOfTickets')
  }

  deleteTicket(ticketId) {
    this.ticketService.deleteTicket(ticketId).subscribe(() => {
      this.ticketService.fetchTickets().subscribe(tickets => {
        this.tickets = tickets;
      })
    })
  }

  editTicket(ticketId) {
    this.router.navigate(["tickets/" + ticketId + "/edit"]);
  }

  redirectToCompanyPage(companyId) {
    this.router.navigate(["companies/" + companyId]);
  }

  apply(parameters, ticket): void {

    if (parameters.numberOfTickets > ticket.count) {
      alert('There is no enough tickets.')
      return;
    }

    console.log(parameters);

    const reservation: Reservation = {
      id: 0,
      isAvailable: 1,
      flightId: ticket.flightId,
      ticketId: ticket.id,
      userId: parseInt(localStorage.getItem("userId")),
      numberOfTickets: parseInt(parameters.numberOfTickets)
    }

    this.reservationService.createReservation(reservation, ticket.count).subscribe(reservation => {
      console.log(reservation);
      this.reservations.push(reservation);
      this.refreshAppliedTickets();

      this.ticketService.fetchTickets().subscribe(tickets => {
        this.tickets = tickets;
      })


      this.reservationService.fetchReservations().subscribe(reservations => {
        console.log('Reservations changed: ', reservations);
        this.reservations = reservations;

      })
      // window.location.reload();

    });

  }

  unapply(ticket): void {
    const reservation: Reservation = {
      id: 0,
      isAvailable: 1,
      flightId: ticket.flightId,
      ticketId: ticket.id,
      userId: parseInt(localStorage.getItem("userId")),
      numberOfTickets: 1
    }

    this.reservationService.deleteReservation(reservation, ticket.count).subscribe(reservation => {
      console.log(reservation);
      this.deleteFromArray(this.reservations, reservation);
      this.refreshAppliedTickets();

      this.ticketService.fetchTickets().subscribe(tickets => {
        this.tickets = tickets;
      })
    });
  }

  public isApplied(ticketId) {
    if (this.reservations != undefined) {
      for (let i = 0; i < this.reservations.length; i++) {
        if (this.reservations[i].ticketId == ticketId && this.reservations[i].userId == parseInt(localStorage.getItem("userId"))) {
          this.applied[ticketId] = true;

          return true;
        }
      }

      this.applied[ticketId] = false;
      return false;
    }
  }

  public refreshAppliedTickets() {
    if (this.tickets != undefined) {
      this.tickets.forEach(ticket => {
        this.applied[ticket.id] = false;
      })

      this.reservations.forEach(item => {
        if (item.userId.toString() == localStorage.getItem("userId")) {
          this.applied[item.ticketId] = true;
        }
      })

      console.log(this.applied);
    }
  }

  public deleteFromArray(reservations, reservationForDelete) {
    for (let i = 0; i < reservations.length; i++) {
      if (reservations[i].flightId == reservationForDelete.flightId &&
        reservations[i].ticketId == reservationForDelete.ticketId &&
        reservations[i].userId == reservationForDelete.userId) {
        reservations.splice(i, 1);
      }
    }
  }

  public countReservedTickets() {
    var counter = 1;

    for (let i = 0; i < this.applied.length; i++) {
      if (this.applied[i] == true) {
        counter++;
      }
    }
  }

  public isReservationExpired(ticket: Ticket) {

    if (ticket.departDate < new Date().getTime()) {
      console.log('first yes')

      return 'Yes'
    }

    var twoDaysAgo = new Date().getTime() + 86400000;

    console.log('Today: ', twoDaysAgo);
    console.log('Depart date: ', ticket.departDate)

    if (ticket.departDate <= twoDaysAgo) {
      console.log('yes')

      return 'Yes';
    } else {
      console.log('no')

      return 'No'
    }

  }

}
