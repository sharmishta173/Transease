import { Request, Response } from "express";
import Bus from "../models/Bus";
import Booking from "../models/Booking";

// POST /api/bookings
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { busId, seats, passengerDetails } = req.body;

    // Validate required fields
    if (!busId || !seats || !passengerDetails) {
      res.status(400).json({ message: "busId, seats and passengerDetails are required" });
      return;
    }

    if (!Array.isArray(seats) || seats.length === 0) {
      res.status(400).json({ message: "seats must be a non-empty array" });
      return;
    }

    if (seats.length !== passengerDetails.length) {
      res.status(400).json({
        message: "Number of passengers must match number of seats selected",
      });
      return;
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      res.status(404).json({ message: "Bus not found" });
      return;
    }

    // Check that all requested seats are available
    const seatMap = new Map();
    bus.seats.forEach((s) => seatMap.set(s.seatNumber, s.isAvailable));
    const unavailable = seats.filter((seatNum: number) => {
      return !seatMap.has(seatNum) || !seatMap.get(seatNum);
    });

    if (unavailable.length > 0) {
      res.status(409).json({
        message: `Seats ${unavailable.join(", ")} are no longer available`,
      });
      return;
    }

    // Mark seats as booked
    bus.seats = bus.seats.map((seat) => {
      if (seats.includes(seat.seatNumber)) {
        seat.isAvailable = false;
      }
      return seat;
    });

    bus.availableSeats = bus.seats.filter((s) => s.isAvailable).length;
    await bus.save();

    // Calculate total price
    const totalPrice = bus.price * seats.length;

    // Save booking
    const booking = await Booking.create({
      busId,
      seats,
      passengerDetails,
      totalPrice,
    });

    res.status(201).json({
      message: "Booking successful",
      id: booking._id,
      seatsBooked: seats,
      totalPrice,
    });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};