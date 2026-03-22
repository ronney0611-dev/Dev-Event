import mongoose from 'mongoose';

//define a function to connect to the database
type MongooseCache = {
    connection: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

//extand the global object to include our mongoose cache
declare global {
    var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

//validate the mongodb uri
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
};

//initialize the cashe on the global object to presist the connection across hot reloads in development
const cashed: MongooseCache = global.mongoose || { connection: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cashed;
}

/*
*establish a connection to mongodb using mongoose
*cash the connection to prevent multiple connections in development
*return the mongoose connection if avilable
*/
async function connectDb(): Promise<typeof mongoose> {
    //return the existing connection if it exists
    if (cashed.connection) {
        return cashed.connection;
    }
    //retutn existing connection promise if one is in progress
    if(!cashed.promise) {
        const options = {
            bufferCommands: false, //disable mongoose buffering to prevent hanging when the connection is lost
        }
        //create a new connection promise and cash it
        cashed.promise = mongoose.connect(MONGODB_URI!, options).then((mongoose)=>{
            return mongoose;
        })
    }

    try {
        //wait for the connection to be established and cash it
        cashed.connection = await cashed.promise;
    } catch (error) {
        //reset the cache if there was an error
        cashed.promise = null;
        throw error;
    }
    return cashed.connection;
}


export default connectDb;
