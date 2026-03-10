'use client'

import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";

const Navbar = () => {
    const handleCreateEventClick = () => {
        posthog.capture('create_event_clicked');
    };

    return (
        <header>
            <nav>
                <Link href='/' className="logo">
                    <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

                    <p>DevEvent</p>
                </Link>

                <ul>
                    <Link href="/">Home</Link>
                    <Link href="/">Events</Link>
                    <Link href="/" onClick={handleCreateEventClick}>Create Event</Link>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar