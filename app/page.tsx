import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { getAllEvents } from "@/lib/actions/eventActions";
import { cacheLife } from "next/cache";

const page = async () => {
  'use cache';
  cacheLife('hours');

  const events = await getAllEvents();

  return (
    <section>
      <h1 className="text-center" >
        The Hub for Every Dev <br /> Event You Can`t Miss
      </h1>
      <p className="text-center mt-5" >Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn />
      <div className="mt-20 space-y-7" >
        <h3 id="events" >Featured Events</h3>
        <ul className="events" >
          {events && events.length > 0 &&
            events.map((e: IEvent) => (
              <li key={e.title} className="list-none" >
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
