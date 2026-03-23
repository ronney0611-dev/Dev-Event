import { Event } from "@/database";
import connectDb from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


//initilize get function to fetch a single event by slug from the database and return it as a json response

export async function GET(res:NextRequest, {params}: {params: Promise<{slug: string}>}) {
    try {
        await connectDb();
        const {slug}= await params;
        console.log(slug);
        const response = await Event.findOne({slug});
        if(!response){
            return new NextResponse("Event not found", { status: 404 });
        }
        return new NextResponse(JSON.stringify(response), { status: 200 });
    } catch (error) {
        return new NextResponse({message: "Failed to fetch event", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}