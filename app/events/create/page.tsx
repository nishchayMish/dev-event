import React from 'react';
import CreateEventForm from '@/components/CreateEventForm';

export const metadata = {
    title: 'Create Event | Dev Event',
    description: 'Host your own developer event and reach thousands of developers.',
};

const CreateEventPage = () => {
    return (
        <div className="max-w-7xl mx-auto py-10">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                    Host a <span className="text-primary italic">Dev Event</span>
                </h1>
                <p className="text-light-200 text-lg max-w-2xl mx-auto">
                    Fill in the details below to publish your event. Make it stand out with a great cover image and clear description.
                </p>
            </div>

            <CreateEventForm />
        </div>
    );
};

export default CreateEventPage;
