import { Component, OnInit, Input } from '@angular/core';
import { ReservationService } from 'src/app/services/reservation/reservation.service'
import { Reservation } from 'src/app/models/reservation.model';
import { HttpClient } from '@angular/common/http';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket/ticket.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {

  public tickets: Ticket[];
  public reservations: Reservation[]
  applied = [] as boolean[];

  constructor(private reservationService: ReservationService,
    private ticketService: TicketService,
    private router: Router) { }

  ngOnInit(): void {

    if (localStorage.getItem('JWT') == undefined) {
      this.router.navigate(['/login']);
    }

    this.reservationService.fetchReservations().subscribe(reservations => {
      this.reservations = reservations;

      this.refreshAppliedTickets();
      //this.countReservedTickets();
    })

    this.ticketService.fetchUserReservedTickets().subscribe(tickets => {
      this.tickets = tickets;
      console.log('Reserved tickets: ', tickets);
    })
  }

  apply(ticket): void {

    const reservation: Reservation = {
      id: 0,
      isAvailable: 1,
      flightId: ticket.flightId,
      ticketId: ticket.id,
      userId: parseInt(localStorage.getItem("userId")),
      numberOfTickets: 1
    }

    this.reservationService.createReservation(reservation, 1).subscribe(reservation => {
      console.log(reservation);
      this.reservations.push(reservation);
      this.refreshAppliedTickets();
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

      this.ticketService.fetchUserReservedTickets().subscribe(tickets => {
        this.tickets = tickets;
        console.log('Reserved tickets: ', tickets);
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

  public fetchReservations() {

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
