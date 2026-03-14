import { Event } from "@/db/eventModel";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    // Extract the image file
    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json(
        { success: false, error: "Image file is required" },
        { status: 400 }
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise((res, rej) => {
      cloudinary.uploader.upload_stream({ resource_type: "image", folder: "DevEvent" }, (err, result) => {
        if (err) return rej(err);
        res(result);
      }).end(buffer);
    });

    const body = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      overview: formData.get("overview") as string,
      image: (uploadResult as { secure_url: string }).secure_url,
      venue: formData.get("venue") as string,
      location: formData.get("location") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      mode: (formData.get("mode") as string)?.toLowerCase(),
      audience: formData.get("audience") as string,
      agenda: (formData.get("agenda") as string)?.split(",").map((s) => s.trim()),
      organizer: formData.get("organizer") as string,
      tags: (formData.get("tags") as string)?.split(",").map((s) => s.trim()),
    };

    const event = await Event.create(body);

    return NextResponse.json(
      { success: true, data: event },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}