import mongoose, { Document, Schema } from "mongoose";

// -- types --
export interface IPassenger {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
}

export interface IBooking extends Document {
  busId: mongoose.Types.ObjectId;
  seats: number[];
  passengerDetails: IPassenger[];
  totalPrice: number;
  bookedAt: Date;
}

// -- sub-schema --
const PassengerSchema = new Schema<IPassenger>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
});

// -- main schema --
const BookingSchema = new Schema<IBooking>(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    seats: [{ type: Number }],
    passengerDetails: [PassengerSchema],
    totalPrice: { type: Number, required: true },
    bookedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);