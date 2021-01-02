import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivationEnd, NavigationStart, Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation/reservation.service'
import { Reservation } from 'src/app/models/reservation.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('login') login;

  public loggedUserUsername: string
  public reservations: Reservation[]
  public reservedTicketsCount: string

  constructor(private router: Router,
    private _elementRef: ElementRef,
    private reservationService: ReservationService) {
  }

  ngOnInit(): void {
    this.loggedUserUsername = localStorage.getItem('username');

    this.reservedTicketsCount = "0";
    //this.reservedTicketsCount = localStorage.getItem("reservedTicketsCount");

    this.reservationService.fetchReservations().subscribe(reservations => {
      console.log('Reservations changed: ', reservations);
      this.reservations = reservations;
      this.reservedTicketsCount = reservations.length.toString();

      //this.refreshAppliedTickets();

      this.countReservedTickets();
    })
  }

  public navigateTo(page: string) {
    page = '/' + page;
    this.router.navigate([page]);
  }

  logoutFromApp() {
    localStorage.removeItem("JWT")
    this.router.navigate(['/login']);
  }

  public countReservedTickets() {

    this.reservationService.fetchReservations().subscribe(reservations => {
      console.log('Reservations changed: ', reservations);
      this.reservations = reservations;
      this.reservedTicketsCount = reservations.length.toString();

      //this.refreshAppliedTickets();

      var counter = 0;

      for (let i = 0; i < this.reservations.length; i++) {
        if (this.reservations[i].userId == parseInt(localStorage.getItem("userId"))) {
          counter++;
        }
        this.reservedTicketsCount = counter.toString();
      }
    })

  }
}
