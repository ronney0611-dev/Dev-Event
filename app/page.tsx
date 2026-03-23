import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const page = async () => {
  const response = await fetch(`${BASE_URL}/api/event`);
  const {events} = await response.json();
  return (
    <section>
      <h1 className="text-center" >
        The Hub for Every Dev <br /> Event You Can`t Miss
      </h1>
      <p className="text-center mt-5" >Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn />
      <div className="mt-20 space-y-7" >
        <h3>Featured Events</h3>
        <ul className="events" >
          { events && events.length > 0 &&
            events.map((e: IEvent) => (
              <li key={e.title} >
                <EventCard {...e} />
              </li>
            ))
          }
        </ul>
      </div>
    </section>
  )
}

export default page
