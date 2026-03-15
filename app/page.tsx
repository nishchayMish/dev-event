import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { IEvent } from "@/db/eventModel"
import { getEvents } from "@/lib/eventActions"
import { cacheLife } from "next/cache"

const Page = async () => {
  'use cache';
  cacheLife('hours')
  const data = await getEvents() as IEvent[]


  return (
    <section>
      <h1 className="text-center">The hub for every Dev <br />Event you cant miss</h1>
      <p className="text-center mt-5">Hackthons, Meetups, and Conference, All in One Place</p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {data && data?.length > 0 && data.map((event: IEvent) => (
            <li className="list-none" key={event.title}>
              <EventCard {...event}
              />
            </li>

          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page 