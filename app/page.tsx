import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { IEvent } from "@/db/eventModel"
import { BASE_URL } from "@/lib/constants"

const Page = async () => {
  const res = await fetch(`${BASE_URL}/events`)
  const events = await res.json()
  const { data } = events


  return (
    <section>
      <h1 className="text-center">The hub for every Dev <br />Event you cant miss</h1>
      <p className="text-center mt-5">Hackthons, Meetups, and Conference, All in One Place</p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {data && data?.length && data.map((event: IEvent) => (
            <li key={event.title}>
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