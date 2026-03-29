export interface Stop {
  stopName: string;
  arrivalTime?: string;
  departureTime?: string;
}

export interface Seat {
  seatNumber: number;
  isAvailable: boolean;
  row: number;
  column: number;
  seatType: "normal" | "semi-sleeper" | "sleeper";
  sleeperLevel?: "upper" | "lower";
}

export interface Bus {
  _id: string;
  name: string;
  departureCity: string;
  arrivalCity: string;
  date: string;
  stops: Stop[];
  seats: Seat[];
  availableSeats: number;
  price: number;
  seatTypes: ("normal" | "semi-sleeper" | "sleeper")[];
  isAC: boolean;
}

export interface BusListResponse {
  page: number;
  pageSize: number;
  totalPages: number;
  totalBuses: number;
  buses: Bus[];
}

export interface Passenger {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
}

export interface BookingPayload {
  busId: string;
  seats: number[];
  passengerDetails: Passenger[];
}

export interface BookingResponse {
  message: string;
  id: string;
  seatsBooked: number[];
  totalPrice: number;
}

export interface SearchParams {
  departureCity: string;
  arrivalCity: string;
  date: string;
}

export interface FilterParams {
  seatType?: string;
  isAC?: string;
  departureSlot?: string;
  page?: number;
  pageSize?: number;
}