import dotenv from "dotenv";
import mongoose from "mongoose";
import Bus from "../models/Bus";

dotenv.config();

// Helpers
const generateSeats = (
    count: number,
    seatType: "normal" | "semi-sleeper" | "sleeper",
    bookedCount: number = 5
) => {
    const seats = [];

    const bookedSeats = new Set<number>();
    while (bookedSeats.size < bookedCount) {
        bookedSeats.add(Math.floor(Math.random() * count) + 1);
    }
    const bookedArray = Array.from(bookedSeats);

    if (seatType === "normal" || seatType === "semi-sleeper") {
        const columns = 4;
        for (let i = 1; i <= count; i++) {
            seats.push({
                seatNumber: i,
                isAvailable: !bookedArray.includes(i),
                row: Math.ceil(i / columns),
                column: ((i - 1) % columns) + 1,
                seatType,
            });
        }
    } else if (seatType === "sleeper") {
        const columns = 3;
        const seatsPerDeck = Math.floor(count / 2);
        
        for (let i = 1; i <= count; i++) {
            const isUpper = i > seatsPerDeck;
            const deckIndex = isUpper ? i - seatsPerDeck : i;
            
            seats.push({
                seatNumber: i,
                isAvailable: !bookedArray.includes(i),
                row: Math.ceil(deckIndex / columns),
                column: ((deckIndex - 1) % columns) + 1,
                seatType,
                sleeperLevel: isUpper ? "upper" : "lower",
            });
        }
    }

    return { seats, availableSeats: count - bookedArray.length };
};

// Realistic Routes with Distances (in km) and Durations (in minutes) between stops
const realisticRoutes = [
    // South India
    {
        from: "Bangalore", to: "Chennai", region: "South", type: "mixed", distance: 350,
        stops: [
            { name: "Bangalore", offsetMins: 0 },
            { name: "Hosur", offsetMins: 60 },
            { name: "Krishnagiri", offsetMins: 120 },
            { name: "Vellore", offsetMins: 210 },
            { name: "Kanchipuram bypass", offsetMins: 285 },
            { name: "Chennai", offsetMins: 390 }
        ]
    },
    {
        from: "Chennai", to: "Bangalore", region: "South", type: "mixed", distance: 350,
        stops: [
            { name: "Chennai", offsetMins: 0 },
            { name: "Kanchipuram bypass", offsetMins: 105 },
            { name: "Vellore", offsetMins: 180 },
            { name: "Krishnagiri", offsetMins: 270 },
            { name: "Hosur", offsetMins: 330 },
            { name: "Bangalore", offsetMins: 390 }
        ]
    },
    {
        from: "Bangalore", to: "Hyderabad", region: "South", type: "overnight", distance: 570,
        stops: [
            { name: "Bangalore", offsetMins: 0 },
            { name: "Chikballapur", offsetMins: 90 },
            { name: "Anantapur", offsetMins: 240 },
            { name: "Kurnool", offsetMins: 360 },
            { name: "Jadcherla", offsetMins: 480 },
            { name: "Hyderabad", offsetMins: 570 }
        ]
    },
    {
        from: "Hyderabad", to: "Bangalore", region: "South", type: "overnight", distance: 570,
        stops: [
            { name: "Hyderabad", offsetMins: 0 },
            { name: "Jadcherla", offsetMins: 90 },
            { name: "Kurnool", offsetMins: 210 },
            { name: "Anantapur", offsetMins: 330 },
            { name: "Chikballapur", offsetMins: 480 },
            { name: "Bangalore", offsetMins: 570 }
        ]
    },
    {
        from: "Bangalore", to: "Goa", region: "South", type: "overnight", distance: 600,
        stops: [
            { name: "Bangalore", offsetMins: 0 },
            { name: "Tumkur", offsetMins: 90 },
            { name: "Hubli", offsetMins: 360 },
            { name: "Dharwad", offsetMins: 400 },
            { name: "Belgaum", offsetMins: 510 },
            { name: "Goa (Panaji)", offsetMins: 720 }
        ]
    },
    {
        from: "Chennai", to: "Coimbatore", region: "South", type: "overnight", distance: 500,
        stops: [
            { name: "Chennai", offsetMins: 0 },
            { name: "Villupuram", offsetMins: 150 },
            { name: "Salem", offsetMins: 300 },
            { name: "Erode", offsetMins: 390 },
            { name: "Coimbatore", offsetMins: 480 }
        ]
    },
    // West India
    {
        from: "Mumbai", to: "Pune", region: "West", type: "day", distance: 150,
        stops: [
            { name: "Mumbai (Dadar)", offsetMins: 0 },
            { name: "Navi Mumbai", offsetMins: 45 },
            { name: "Lonavala", offsetMins: 120 },
            { name: "Wakad", offsetMins: 180 },
            { name: "Pune (Swargate)", offsetMins: 240 }
        ]
    },
    {
        from: "Pune", to: "Mumbai", region: "West", type: "day", distance: 150,
        stops: [
            { name: "Pune (Swargate)", offsetMins: 0 },
            { name: "Wakad", offsetMins: 60 },
            { name: "Lonavala", offsetMins: 120 },
            { name: "Navi Mumbai", offsetMins: 195 },
            { name: "Mumbai (Dadar)", offsetMins: 240 }
        ]
    },
    {
        from: "Mumbai", to: "Goa", region: "West", type: "overnight", distance: 590,
        stops: [
            { name: "Mumbai (Andheri)", offsetMins: 0 },
            { name: "Pune", offsetMins: 240 },
            { name: "Satara", offsetMins: 360 },
            { name: "Kolhapur", offsetMins: 510 },
            { name: "Belgaum", offsetMins: 660 },
            { name: "Goa (Panaji)", offsetMins: 840 }
        ]
    },
    {
        from: "Ahmedabad", to: "Surat", region: "West", type: "day", distance: 260,
        stops: [
            { name: "Ahmedabad", offsetMins: 0 },
            { name: "Nadiad", offsetMins: 60 },
            { name: "Anand", offsetMins: 90 },
            { name: "Vadodara", offsetMins: 120 },
            { name: "Bharuch", offsetMins: 210 },
            { name: "Surat", offsetMins: 270 }
        ]
    },
    // North India
    {
        from: "Delhi", to: "Jaipur", region: "North", type: "mixed", distance: 280,
        stops: [
            { name: "Delhi (Kashmere Gate)", offsetMins: 0 },
            { name: "Gurgaon", offsetMins: 60 },
            { name: "Neemrana", offsetMins: 150 },
            { name: "Kotputli", offsetMins: 210 },
            { name: "Jaipur (Sindhi Camp)", offsetMins: 330 }
        ]
    },
    {
        from: "Jaipur", to: "Delhi", region: "North", type: "mixed", distance: 280,
        stops: [
            { name: "Jaipur (Sindhi Camp)", offsetMins: 0 },
            { name: "Kotputli", offsetMins: 120 },
            { name: "Neemrana", offsetMins: 180 },
            { name: "Gurgaon", offsetMins: 270 },
            { name: "Delhi (Kashmere Gate)", offsetMins: 330 }
        ]
    },
    {
        from: "Delhi", to: "Chandigarh", region: "North", type: "mixed", distance: 250,
        stops: [
            { name: "Delhi", offsetMins: 0 },
            { name: "Panipat", offsetMins: 90 },
            { name: "Karnal", offsetMins: 150 },
            { name: "Ambala", offsetMins: 210 },
            { name: "Chandigarh", offsetMins: 270 }
        ]
    },
    {
        from: "Delhi", to: "Dehradun", region: "North", type: "mixed", distance: 260,
        stops: [
            { name: "Delhi", offsetMins: 0 },
            { name: "Meerut", offsetMins: 90 },
            { name: "Muzaffarnagar", offsetMins: 180 },
            { name: "Roorkee", offsetMins: 240 },
            { name: "Dehradun", offsetMins: 360 }
        ]
    }
];

const regionalOperators: Record<string, string[]> = {
    South: ["KSRTC Airavat", "SRS Travels", "VRL Travels", "Orange Travels", "Kallada Travels", "GreenLine", "Jabbar Travels", "Morning Star", "Sharma Transports"],
    West: ["Neeta Tours", "MSRTC Shivneri", "Purple Travels", "Paulo Travels", "Atmaram Travels", "Kadamba Transport", "Zingbus", "Prasanna Purple", "Gujarat Travels"],
    North: ["RSRTC Volvo", "Vikas Travels", "Mahalaxmi Travels", "IntrCity SmartBus", "National Travels", "NueGo", "RS Yadav Travels", "Laxmi Holidays"]
};

// Generates time formats accurately
const formatTimeAndDate = (baseDateStr: string, startHour: number, startMinute: number, offsetMins: number) => {
    // We treat the baseDateStr as representing departure day at 00:00.
    const dateObj = new Date(`${baseDateStr}T00:00:00Z`); // using UTC for simplicity to avoid timezone jumps
    const departureDate = new Date(dateObj.getTime() + (startHour * 60 + startMinute) * 60000);
    const arrivalDate = new Date(departureDate.getTime() + offsetMins * 60000);

    const formatHourAmPm = (dateStr: Date) => {
        let h = dateStr.getUTCHours();
        let m = dateStr.getUTCMinutes().toString().padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        if (h === 0) h = 12;
        return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
    };

    return formatHourAmPm(arrivalDate);
};

const generateBuses = () => {
    const generatedBuses = [];
    // Next 25 days starting 2026-03-26
    const dates = [];
    let start = new Date("2026-03-26T00:00:00Z");
    for (let i = 0; i < 25; i++) {
        dates.push(start.toISOString().split("T")[0]);
        start.setDate(start.getDate() + 1);
    }

    for (const route of realisticRoutes) {
        // High volume: 8 to 15 buses per day per route
        for (const date of dates) {
            const numBuses = Math.floor(Math.random() * 8) + 8; // 8 to 15
            
            for (let i = 0; i < numBuses; i++) {
                const availableOperators = regionalOperators[route.region] || regionalOperators["South"];
                const operator = availableOperators[Math.floor(Math.random() * availableOperators.length)];
                
                // Seat type
                let seatType: "normal" | "semi-sleeper" | "sleeper" = "semi-sleeper";
                let isAC = true;

                if (route.type === "overnight") {
                    seatType = Math.random() > 0.3 ? "sleeper" : "semi-sleeper";
                    isAC = Math.random() > 0.1; // 90% AC for overnight
                } else if (route.type === "day") {
                    seatType = Math.random() > 0.5 ? "normal" : "semi-sleeper";
                    isAC = Math.random() > 0.4; // 60% AC for day
                } else {
                    const types: ("normal" | "semi-sleeper" | "sleeper")[] = ["normal", "semi-sleeper", "sleeper"];
                    seatType = types[Math.floor(Math.random() * types.length)];
                    isAC = Math.random() > 0.3;
                }
                
                let totalSeats = 40;
                if (seatType === "sleeper") totalSeats = 30;
                if (seatType === "semi-sleeper") totalSeats = 36;
                if (seatType === "normal") totalSeats = 40;
                
                // Realistic Booking logic (closer dates have more bookings)
                const daysUntilDeparture = new Date(date).getTime() - new Date("2026-03-26").getTime();
                let bookedPercentage = Math.random() * 0.4 + 0.1; // 10% to 50%
                if (daysUntilDeparture < 3 * 86400000) bookedPercentage += 0.4; // Last minute rush up to 90% booked
                
                let bookedCount = Math.floor(totalSeats * bookedPercentage);
                if (bookedCount >= totalSeats) bookedCount = totalSeats - 2;

                const { seats, availableSeats } = generateSeats(totalSeats, seatType, bookedCount);
                
                // Realistic Pricing
                let pricePerKm = 1.8;
                if (seatType === "semi-sleeper") pricePerKm = 2.2;
                if (seatType === "sleeper") pricePerKm = 3.0;
                if (isAC) pricePerKm *= 1.3;
                
                // Add some premium for certain operators
                let brandPremium = 1;
                if (["IntrCity SmartBus", "Zingbus", "NueGo", "Orange Travels"].includes(operator)) {
                    brandPremium = 1.15;
                }

                let basePrice = route.distance * pricePerKm * brandPremium;
                // Add random variation +/- 10%
                const price = Math.round((basePrice + (Math.random() * 200 - 100)) / 10) * 10;

                // Time slots based on route type
                let startHour = 0;
                if (route.type === "overnight" || seatType === "sleeper") {
                    // Departs between 16:00 and 23:00
                    startHour = Math.floor(Math.random() * 8) + 16;
                } else if (route.type === "day") {
                    // Departs between 05:00 and 15:00
                    startHour = Math.floor(Math.random() * 11) + 5;
                } else {
                    // Mixed
                    startHour = Math.floor(Math.random() * 18) + 5; // 05:00 to 23:00
                }
                const startMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
                
                const stops = [];
                for (let j = 0; j < route.stops.length; j++) {
                    const stopInfo = route.stops[j];
                    const stopObj: any = { stopName: stopInfo.name };
                    
                    if (j === 0) {
                        stopObj.departureTime = formatTimeAndDate(date, startHour, startMinute, stopInfo.offsetMins);
                    } else if (j === route.stops.length - 1) {
                        stopObj.arrivalTime = formatTimeAndDate(date, startHour, startMinute, stopInfo.offsetMins);
                    } else {
                        stopObj.arrivalTime = formatTimeAndDate(date, startHour, startMinute, stopInfo.offsetMins);
                        // Departure from intermediate stop usually 10-15 mins later
                        stopObj.departureTime = formatTimeAndDate(date, startHour, startMinute, stopInfo.offsetMins + 15);
                    }
                    stops.push(stopObj);
                }

                generatedBuses.push({
                    name: operator,
                    departureCity: route.from,
                    arrivalCity: route.to,
                    date,
                    stops,
                    seats,
                    availableSeats,
                    price: price,
                    seatTypes: [seatType],
                    isAC,
                });
            }
        }
    }
    
    return generatedBuses;
};

const seed = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error("MONGO_URI missing in .env");

        await mongoose.connect(uri);
        console.log("Connected to MongoDB...");

        await Bus.deleteMany({});
        console.log("Cleared existing bus data");

        const generatedData = generateBuses();
        console.log(`Generated ${generatedData.length} highly realistic buses.`);

        const batchSize = 250;
        // Optimization for massive seeding insertions
        const batches = [];
        for (let i = 0; i < generatedData.length; i += batchSize) {
            batches.push(generatedData.slice(i, i + batchSize));
        }
        for (const batch of batches) {
             await Bus.insertMany(batch);
        }
        
        console.log(`Seeded ${generatedData.length} buses successfully ✅`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seed();