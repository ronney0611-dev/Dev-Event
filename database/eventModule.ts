import { model, models, Schema, Document } from "mongoose";


// type script interface for event documents
export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode:string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
    title:{
        type: String,
        required: [true, "Event title is required"],
        trim: true,
        maxlength: [100, "Event title cannot exceed 100 characters"],
    },
    slug:{
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    description:{
        type: String,
        required: [true, "Event description is required"],
        trim: true,
        maxlength: [500, "Event description cannot exceed 500 characters"],
    },
    overview:{
        type: String,
        required: [true, "Event overview is required"],
        trim: true,
        maxlength: [1000, "Event overview cannot exceed 1000 characters"],
    },
    image:{
        type: String,
        required: [true, "Event image URL is required"],
        trim: true,
    },
    venue:{
        type: String,
        required: [true, "Event venue is required"],
        trim: true,
    },
    location:{
        type: String,
        required: [true, "Event location is required"],
        trim: true,
    },
    date:{
        type: String,
        required: [true, "Event date is required"],
    },
    time:{
        type: String,
        required: [true, "Event time is required"],
    },
    mode:{
        type: String,
        required: [true, "Event mode is required"],
        enum: {
            values: ["Online", "In-Person", "Hybrid"],
            message: "Event mode must be either Online, In-Person, or Hybrid",
        }
    },
    audience:{
        type: String,
        required: [true, "Event audience is required"],
        trim: true,
    },
    agenda:{
        type: [String],
        required: [true, "Event agenda is required"],
        validate: {
            validator: (value: string[]) => value.length > 0,
            message: "Event agenda must have at least one item",
        }  
    },
    organizer:{
        type: String,
        required: [true, "Event organizer is required"],
        trim: true,
    },
    tags:{
        type: [String],
        required: [true, "Event tags are required"],
        validate: {
            validator: (value: string[]) => value.length > 0,
            message: "Event tags must have at least one tag",
        }
    },
}, {
    timestamps: true,
});

//pre-save hook for slug generation and data normalization
EventSchema.pre('save', async function(this: IEvent){
    const event = this as IEvent;
    //generat slug only if title is modified or document is new
    if(event.isModified('title') || event.isNew){
        event.slug = generateSlug(event.title);
    }

    //normalize dete to ISO format if it's not already in that format
    if(event.isModified('date')){
        event.date = normalizeDate(event.date);
    }

    //normalize time format (HH:MM)
    if(event.isModified('time')){
        event.time = normalizeTime(event.time);
    }
});

//helper function to generate slug from title
function generateSlug(title:string):string{
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') //remove special characters
        .replace(/\s+/g, '-') //replace spaces with hyphens
        .replace(/-+/g, '-') //replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); //remove leading and trailing hyphens
}

//helper function to normalize date to ISO format (YYYY-MM-DD)
function normalizeDate(dateString:string):string{
    const date = new Date(dateString);
    if(isNaN(date.getTime())){
        throw new Error("Invalid date format. Date must be in a recognizable format.");
    }
    return date.toISOString().split('T')[0]; //return only the date part (YYYY-MM-DD)
}

//helper function to normalize time to HH:MM format
function normalizeTime(timeString:string):string{
    //handle various time format and convert to HH:MM
    const timeRegex = /^(\d{1,2}):(\d{2})(?:\s?(AM|PM))?$/i;
    const match = timeString.match(timeRegex);

    if(!match){
        throw new Error("Invalid time format. Time must be in HH:MM format, optionally with AM/PM.");
    }
    let hours = parseInt(match[1]);
    const minutes = match[2];   
    const period = match[3]?.toUpperCase();

    if(period){
        //convert 12-hour format to 24-hour format
        if(period === 'PM' && hours < 12) hours += 12;
        if(period === 'AM' && hours === 12) hours = 0; 
    }
    if(hours < 0 || hours > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59){
        throw new Error("Invalid time value. Hours must be between 0-23 and minutes must be between 0-59.");
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

//craet unique index for better performance on 
EventSchema.index({ slug: 1 }, { unique: true });
//creat compound index for common queries
EventSchema.index({ date: 1, mode: 1 });

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;
