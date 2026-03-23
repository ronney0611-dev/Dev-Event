import { Event } from "@/database";
import { uploadImage } from "@/lib/cloudinary";
import connectDb from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (error) {
            return new Response("Invalid form data", { status: 400 });
        }

        //cloudinary upload logic

        const imageFile = formData.get('image') as File //get the image file from the form data

        if (!imageFile) {
            return new Response("Image file is required", { status: 400 });
        }
        
        const arrayBuffer = await imageFile.arrayBuffer(); //convert the file to an array buffer

        const buffer = Buffer.from(arrayBuffer); //convert the array buffer to a node buffer

        const uploaderImgae = await uploadImage(buffer, imageFile.name); //upload the image to cloudinary and get the response

        event.image = uploaderImgae.secure_url; //add the secure url of the uploaded image to the event data  

        const createdEvent = await Event.create(event);

        return NextResponse.json({message: "Event created successfully", event: createdEvent }, { status: 201 });

    } catch (error) {
        return NextResponse.json({message: "Failed to connect to database", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

export async function GET(){
    try {
        await connectDb();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({message: "Events fetched successfully", events }, { status: 200 });
    } catch (error) {
        return NextResponse.json({message: "Failed to connect to database", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
