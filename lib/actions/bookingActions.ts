'use server';

import { Booking } from "@/database";
import connectDb from "../mongodb";

export const createBooking = async ({eventId, slug, email}: { eventId: string; slug: string; email: string }) => {
    try {
        await connectDb();
        const booking = await Booking.create({ eventId, slug, email });
        //.lean();
        //lean() is used to return a plain JavaScript object instead of a Mongoose document, which can improve performance and reduce memory usage when you don't need the additional features of a Mongoose document.
        // toObject() is used to convert a Mongoose document into a plain JavaScript object. This is often done to remove Mongoose-specific properties and methods, making it easier to work with the data in a more standard JavaScript format.
        return { success: true, message: 'Booking created successfully' };
    } catch (error) {
        console.error('Error creating booking:', error);
        return { success: false, message: 'Failed to create booking',error: error };
    }
}