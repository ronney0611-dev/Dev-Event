import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getEventBySlug, getSimilarEventsBySlug } from "@/lib/actions/eventActions";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string; }) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)
const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
)

const EventDetailsSuspense = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const response = await getEventBySlug(slug);

    if (!response) return notFound();

    const bookings = 10;

    const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

    console.log(similarEvents);
    return (
        <section id='event' >
            <div className="header" >
                <h1>Event Description</h1>
                <p className="mt-2" >{response.description}</p>
            </div>

            <div className="details" >
                {/* leftside */}
                <div className="content" >
                    <Image src={response.image} alt="ecent-img" width={800} height={800} className="banner" />
                    <section className="flex-col-gap-2" >
                        <h2>Overview</h2>
                        <p>{response.overview}</p>
                    </section>
                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={response.date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="clock" label={response.time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="pin" label={response.location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="mode" label={response.mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={response.audience} />
                    </section>
                    <EventAgenda agendaItems={response.agenda} />
                    <section className="flex-col-gap-2 ">
                        <h2>About the Organizer</h2>
                        <p className="text-xl text-white " >{response.organizer}</p>
                    </section>
                </div>

                {/* rightside - Booking */}
                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        {bookings > 0 ? (
                            <p className="text-sm">
                                Join {bookings} people who have already booked their spot!
                            </p>
                        ) : (
                            <p className="text-sm">Be the first to book your spot!</p>
                        )}

                        <BookEvent eventId={response._id.toString()} slug={response.slug} />
                    </div>
                </aside>
            </div>
            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
                        <EventCard
                            key={similarEvent.slug}
                            title={similarEvent.title}
                            image={similarEvent.image}
                            slug={similarEvent.slug}
                            location={similarEvent.location}
                            date={similarEvent.date}
                            time={similarEvent.time}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}



const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    return (
        <Suspense>
            <EventDetailsSuspense params={params} />
        </Suspense>
    )
}

export default EventDetailsPage;
