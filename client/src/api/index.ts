import axios from "axios";
import type {
  BusListResponse,
  Bus,
  BookingPayload,
  BookingResponse,
  FilterParams,
  SearchParams,
} from "../types";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const api = axios.create({
  baseURL: `${apiBaseUrl.replace(/\/+$/, "")}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchBuses = async (
  search: SearchParams,
  filters: FilterParams = {}
): Promise<BusListResponse> => {
  const params = {
    ...search,
    ...filters,
  };
  const { data } = await api.get<BusListResponse>("/buses", { params });
  return data;
};

export const fetchBusById = async (busId: string): Promise<Bus> => {
  const { data } = await api.get<Bus>(`/buses/${busId}`);
  return data;
};

export const createBooking = async (
  payload: BookingPayload
): Promise<BookingResponse> => {
  const { data } = await api.post<BookingResponse>("/bookings", payload);
  return data;
};