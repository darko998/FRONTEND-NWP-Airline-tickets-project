import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private readonly baseUrl = "http://localhost:8080/reservations";

  private reservations: Observable<Reservation[]>
  private newReservation: Observable<Reservation>

  constructor(private http: HttpClient) { }

  public getReservations() {
    if (this.reservations == undefined) {
      this.fetchReservations();
    }

    return this.reservations;
  }

  fetchReservations() {
    this.reservations = this.http.get<Reservation[]>(this.baseUrl, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    this.reservations.forEach(item => {
      console.log('darko ', item);
    })

    return this.reservations;
  }

  createReservation(reservation: Reservation, numOfTickets) {
    this.newReservation = this.http.post<Reservation>(this.baseUrl, reservation, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      },
      params: {
        availableNumberOfTickets: numOfTickets
      }
    });

    this.fetchReservations();

    return this.newReservation;
  }

  deleteReservation(reservation: Reservation, numOfTickets) {
    this.newReservation = this.http.post<Reservation>(this.baseUrl + "/delete", reservation, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      },
      params: {
        availableNumberOfTickets: numOfTickets
      }
    })

    this.fetchReservations();

    return this.newReservation;
  }
}
