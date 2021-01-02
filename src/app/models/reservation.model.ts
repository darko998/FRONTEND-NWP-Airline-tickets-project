export interface Reservation {
    id: number;
    isAvailable: number;
    flightId: number;
    ticketId: number;
    userId: number;
    numberOfTickets: number;
}