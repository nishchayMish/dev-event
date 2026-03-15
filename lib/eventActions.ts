'use server';

import { Event } from '@/db/eventModel';
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();

        const event = await Event.findOne({ slug }).lean();
        if (!event) return [];

        const similarEvents = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags },
        }).lean();

        return similarEvents.map((event) => ({
            ...event,
            _id: event._id.toString(),
        }));

    } catch {
        return [];
    }
};

export const getEvents = async () => {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}

export const getEventBySlug = async (slug: string) => {
    try {
        await connectDB();
        const sanitizedSlug = slug.trim().toLowerCase();
        const event = await Event.findOne({ slug: sanitizedSlug }).lean();
        if (!event) return null;
        return {
            ...event,
            _id: event._id.toString(),
        };
    } catch (error) {
        console.error("Error fetching event by slug:", error);
        return null;
    }
}