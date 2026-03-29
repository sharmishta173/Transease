import mongoose, { Document, Schema } from "mongoose";

// -- types --
export interface IStop {
  stopName: string;
  arrivalTime?: string;
  departureTime?: string;
}

export interface ISeat {
  seatNumber: number;
  isAvailable: boolean;
  row: number;
  column: number;
  seatType: "normal" | "semi-sleeper" | "sleeper";
  sleeperLevel?: "upper" | "lower";
}

export interface IBus extends Document {
  name: string;
  departureCity: string;
  arrivalCity: string;
  date: string;
  stops: IStop[];
  seats: ISeat[];
  availableSeats: number;
  price: number;
  seatTypes: ("normal" | "semi-sleeper" | "sleeper")[];
  isAC: boolean;
}

// -- sub-schemas --
const StopSchema = new Schema<IStop>({
  stopName: { type: String, required: true },
  arrivalTime: { type: String },
  departureTime: { type: String },
});

const SeatSchema = new Schema<ISeat>({
  seatNumber: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  row: { type: Number, required: true },
  column: { type: Number, required: true },
  seatType: {
    type: String,
    enum: ["normal", "semi-sleeper", "sleeper"],
    required: true,
  },
  sleeperLevel: {
    type: String,
    enum: ["upper", "lower"],
  },
});

// -- main schema --
const BusSchema = new Schema<IBus>(
  {
    name: { type: String, required: true },
    departureCity: { type: String, required: true },
    arrivalCity: { type: String, required: true },
    date: { type: String, required: true },
    stops: [StopSchema],
    seats: [SeatSchema],
    availableSeats: { type: Number, required: true },
    price: { type: Number, required: true },
    seatTypes: [
      {
        type: String,
        enum: ["normal", "semi-sleeper", "sleeper"],
      },
    ],
    isAC: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBus>("Bus", BusSchema);