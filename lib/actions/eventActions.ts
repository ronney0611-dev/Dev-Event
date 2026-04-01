'use server';

import { Event } from "@/database";
import connectDb from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDb();
        const evnet = await Event.findOne({ slug });
        const similarEvents = await Event.find({_id : {$ne: evnet._id}, tags: { $in: evnet.tags }}).lean();

        return similarEvents;
    } catch (error) {
        return [];
    }
}

export const getAllEvents = async ()=>{
    try {
        await connectDb();
        const allEvents = await Event.find().sort({ createdAt: -1 }).lean();
        return allEvents;
    } catch (error) {
        return [];
    }
}

export const getEventBySlug = async (slug: string) => {
    try {
        await connectDb();
        const event = await Event.findOne({ slug }).lean();
        return event;
    } catch (error) {
        return null;
    }
}