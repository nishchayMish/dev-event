const EventDetailsSkeleton = () => {
    return (
        <section id="event" className="animate-in fade-in duration-500">
            <div className="header">
                <div className="skeleton h-12 w-3/4 mb-4" />
                <div className="skeleton h-6 w-full" />
                <div className="skeleton h-6 w-5/6 mt-2" />
            </div>

            <div className="details">
                {/* Left Side - Event Content */}
                <div className="content">
                    <div className="skeleton banner w-full h-[457px] mb-8" />

                    <section className="flex-col-gap-2">
                        <div className="skeleton h-8 w-32 mb-2" />
                        <div className="skeleton h-4 w-full" />
                        <div className="skeleton h-4 w-full" />
                        <div className="skeleton h-4 w-3/4" />
                    </section>

                    <section className="flex-col-gap-2 mt-8">
                        <div className="skeleton h-8 w-40 mb-2" />
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="skeleton h-5 w-5 rounded-full" />
                                    <div className="skeleton h-4 w-32" />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="flex-col-gap-2 mt-8">
                        <div className="skeleton h-8 w-24 mb-2" />
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="skeleton h-4 w-full" />
                            ))}
                        </div>
                    </section>

                    <div className="flex flex-row gap-2 mt-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="skeleton h-8 w-16 rounded-full" />
                        ))}
                    </div>
                </div>

                {/* Right Side - Booking Form */}
                <aside className="booking">
                    <div className="signup-card">
                        <div className="skeleton h-8 w-40 mb-4" />
                        <div className="skeleton h-4 w-full mb-6" />
                        <div className="skeleton h-12 w-full rounded-md" />
                    </div>
                </aside>
            </div>

            <div className="flex w-full flex-col gap-4 pt-20">
                <div className="skeleton h-8 w-48 mb-4" />
                <div className="events">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <div className="skeleton h-[300px] w-full rounded-lg" />
                            <div className="skeleton h-6 w-3/4" />
                            <div className="skeleton h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventDetailsSkeleton;
