'use server';

import { Event } from "@/database";
import connectDb from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDb();
        const evnet = await Event.findOne({ slug });
        const similarEvents = await Event.find({_id : {$ne: evnet._id}, tags: { $in: evnet.tags }});

        return similarEvents;
    } catch (error) {
        return [];
    }
}