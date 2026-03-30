import { Request, Response } from "express";
import Bus from "../models/Bus";

const SLOT_RANGES: Record<string, { start: number; end: number }> = {
  morning: { start: 6, end: 12 },
  afternoon: { start: 12, end: 16 },
  evening: { start: 16, end: 20 },
  night: { start: 20, end: 30 },
};

// GET/api/buses
export const getBuses = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      departureCity,
      arrivalCity,
      date,
      seatType,
      isAC,
      departureSlot,
      page = "1",
      pageSize = "10",
    } = req.query;


    if (!departureCity || !arrivalCity || !date) {
      res.status(400).json({ message: "departureCity, arrivalCity and date are required" });
      return;
    }

    const filter: any = {
      departureCity: { $regex: new RegExp(departureCity as string, "i") },
      arrivalCity: { $regex: new RegExp(arrivalCity as string, "i") },
      date: date as string,
    };

    if (seatType) {
      filter.seatTypes = { $in: [seatType] };
    }

    if (isAC !== undefined) {
      filter.isAC = isAC === "true";
    }

    const pageNum = parseInt(page as string);
    const pageSizeNum = parseInt(pageSize as string);
    const skip = (pageNum - 1) * pageSizeNum;

    let buses = await Bus.find(filter).lean();

    const normalizedDepartureSlot = Array.isArray(departureSlot)
      ? departureSlot[0]
      : departureSlot;

    if (typeof normalizedDepartureSlot === "string" && normalizedDepartureSlot.trim()) {
      const slot = SLOT_RANGES[normalizedDepartureSlot.trim().toLowerCase()];
      if (slot) {
        buses = buses.filter((bus) => {
          const firstStop = bus.stops[0];
          if (!firstStop?.departureTime) return false;

          // parse "09:00 AM" -> 24hr number
          const [timePart, meridiem] = firstStop.departureTime.split(" ");
          const [hourStr] = timePart.split(":");
          let hour = parseInt(hourStr);
          if (meridiem === "PM" && hour !== 12) hour += 12;
          if (meridiem === "AM" && hour === 12) hour = 0;

          return hour >= slot.start && hour < slot.end;
        });
      }
    }

    const totalBuses = buses.length;
    const totalPages = Math.ceil(totalBuses / pageSizeNum);
    const paginated = buses.slice(skip, skip + pageSizeNum);

    res.status(200).json({
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages,
      totalBuses,
      buses: paginated,
    });
  } catch (err) {
    console.error("getBuses error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//GET/api/buses/:busId
export const getBusById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findById(busId).lean();

    if (!bus) {
      res.status(404).json({ message: "Bus not found" });
      return;
    }

    res.status(200).json(bus);
  } catch (err) {
    console.error("getBusById error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};