import { Event } from "@/db/eventModel";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  let uploadResult: any = null;

  try {
    await connectDB();
    const formData = await req.formData();

    // Parse JSON FIRST
    const tags = JSON.parse(formData.get("tags") as string);
    const agenda = JSON.parse(formData.get("agenda") as string);

    // Validate image
    const file = formData.get("image");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { success: false, error: "Image file is required" },
        { status: 400 }
      );
    }

    // Validate and normalize slug
    const rawSlug = formData.get("slug") as string;
    if (!rawSlug || rawSlug.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    const slug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Invalid slug" },
        { status: 400 }
      );
    }


    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload image
    uploadResult = await new Promise((res, rej) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (err, result) => {
            if (err) return rej(err);
            res(result);
          }
        )
        .end(buffer);
    });

    const body = {
      title: formData.get("title") as string,
      slug: slug,

      description: formData.get("description") as string,
      overview: formData.get("overview") as string,
      image: (uploadResult as { secure_url: string }).secure_url,
      venue: formData.get("venue") as string,
      location: formData.get("location") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      mode: (formData.get("mode") as string)?.toLowerCase(),
      audience: formData.get("audience") as string,
      organizer: formData.get("organizer") as string,
      tags,
      agenda,
    };

    const event = await Event.create(body);

    return NextResponse.json(
      { success: true, data: event },
      { status: 201 }
    );

  } catch (error: any) {

    // CLEANUP CLOUDINARY IMAGE IF DB FAILS
    if (uploadResult?.public_id) {
      await cloudinary.uploader.destroy(uploadResult.public_id);
    }

    if (error.code === 11000 || error.name === "MongoServerError") {
      return NextResponse.json(
        { success: false, error: "An event with this slug already exists" },
        { status: 409 }
      );
    }

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