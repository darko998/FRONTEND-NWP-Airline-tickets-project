import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { Ticket } from 'src/app/models/ticket.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private readonly baseUrl = "http://localhost:8080/tickets";

  private tickets: Observable<Ticket[]>
  private userReservedTickets: Observable<Ticket[]>
  private companyTickets: Observable<Ticket[]>
  private newTicket: Observable<Ticket>
  private updatedTicket: Observable<Ticket>
  private ticketById: Observable<Ticket>


  constructor(private http: HttpClient) { }

  public getTickets() {
    if (this.tickets == undefined) {
      this.fetchTickets();
    }

    return this.tickets;
  }

  fetchTickets() {
    this.tickets = this.http.get<Ticket[]>(this.baseUrl + "/dtos", {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    console.log('Fetched tickets: ', this.tickets);
    return this.tickets;
  }

  fetchUserReservedTickets() {
    this.userReservedTickets = this.http.get<Ticket[]>(this.baseUrl + "/user/" + localStorage.getItem("userId"), {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    return this.userReservedTickets;
  }

  fetchCompanyTickets(companyId) {
    this.companyTickets = this.http.get<Ticket[]>(this.baseUrl + "/company/" + companyId, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    return this.companyTickets;
  }

  fetchTicketById(id) {
    this.ticketById = this.http.get<Ticket>(this.baseUrl + "/" + id, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    return this.ticketById;
  }

  addTicket(ticket) {
    this.newTicket = this.http.post<Ticket>(this.baseUrl, ticket, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    return this.newTicket;
  }

  updateTicket(ticket) {
    this.updatedTicket = this.http.put<Ticket>(this.baseUrl, ticket, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    this.fetchTickets();

    return this.updatedTicket;
  }

  deleteTicket(id) {
    this.http.delete(this.baseUrl + "/" + id, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    }).toPromise();

    return this.tickets;
  }
}
