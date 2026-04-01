'use client';
import { createBooking } from "@/lib/actions/bookingActions";
import { useState } from "react";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { success , error} = await createBooking({eventId, slug, email});

        if (success) {
            setSubmitted(true);
        } else {
            console.error('booking failed:', error);
        }

        setTimeout(()=>{
            setSubmitted(true);     
        }, 1000);
    }
    return (
        <div id='bookEvent'>
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ): (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email address"
                            className="w-full py-1 rounded border my-2 px-2"
                        />
                    </div>

                    <button className="w-full py-1 cursor-pointer  bg-blue-200 text-black rounded my-2 " type="submit" >Submit</button>
                </form>
            )}
        </div>
    )
}

export default BookEvent
