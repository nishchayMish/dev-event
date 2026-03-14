import { Event } from "@/db/eventModel";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    params: {
        slug: string;
    };
}

export async function GET(req: NextRequest, { params }: Params) {
    try {
        await connectDB();

        const { slug } = await params;
        const sanitizedSlug = slug.trim().toLowerCase();
        if (!sanitizedSlug) {
            return NextResponse.json(
                { success: false, message: "Slug is required" },
                { status: 400 }
            );
        }

        const event = await Event.findOne({ slug: sanitizedSlug }).lean();

        if (!event) {
            return NextResponse.json(
                { success: false, message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: event },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching event:", error);

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}