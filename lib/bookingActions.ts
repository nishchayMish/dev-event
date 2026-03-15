'use server';

import { Booking } from '@/db/bookingModel';
import connectDB from './mongodb';


export const createBooking = async ({ eventId, email }: { eventId: string; email: string; }) => {
    try {
        await connectDB();

        await Booking.create({ eventId, email });

        return { success: true };
    } catch (e) {
        console.error('create booking failed', e);
        return { success: false };
    }
}

export const getBookingCountByEventId = async (eventId: string) => {
    try {
        await connectDB();
        const count = await Booking.countDocuments({ eventId });
        return count;
    } catch (e) {
        console.error('get booking count failed', e);
        return 0;
    }
}