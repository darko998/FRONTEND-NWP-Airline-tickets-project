export interface Ticket {
    id: number;
    companyId: number;
    companyName: String;
    oneWay: number;
    departDate: number;
    returnDate: number;
    flightId: Number;
    originCity: String;
    destinationCity: String;
    count: Number;
    reserved: Number;
}