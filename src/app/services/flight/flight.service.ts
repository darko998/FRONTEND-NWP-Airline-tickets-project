import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { Flight } from 'src/app/models/flight.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private readonly baseUrl = "http://localhost:8080/flights";

  private flights: Observable<Flight[]>
  public newFlight: Observable<Flight>

  constructor(private http: HttpClient) { }

  public getFlights() {
    if (this.flights == undefined) {
      this.fetchFlights();
    }

    return this.flights;
  }

  fetchFlights() {
    this.flights = this.http.get<Flight[]>(this.baseUrl + "/dtos", {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    return this.flights;
  }

  addFlight(flight) {
    this.newFlight = this.http.post<Flight>(this.baseUrl, flight, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    return this.newFlight;
  }
}
