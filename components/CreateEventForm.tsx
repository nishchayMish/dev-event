'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Plus, Trash2, Calendar, Clock, MapPin, Globe, Users, Tag } from 'lucide-react';

const CreateEventForm = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        overview: '',
        venue: '',
        location: '',
        date: '',
        time: '',
        mode: 'offline',
        audience: '',
        organizer: '',
        tags: '',
        agenda: [''],
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Auto-generate slug from title if slug is empty or matches previous title slug
            if (name === 'title' && (!prev.slug || prev.slug === prev.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''))) {
                newData.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            }
            return newData;
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAgendaChange = (index: number, value: string) => {
        const newAgenda = [...formData.agenda];
        newAgenda[index] = value;
        setFormData(prev => ({ ...prev, agenda: newAgenda }));
    };

    const addAgendaItem = () => {
        setFormData(prev => ({ ...prev, agenda: [...prev.agenda, ''] }));
    };

    const removeAgendaItem = (index: number) => {
        if (formData.agenda.length > 1) {
            const newAgenda = formData.agenda.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, agenda: newAgenda }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const submitData = new FormData();
            
            // Add basic fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'tags' && key !== 'agenda') {
                    submitData.append(key, value as string);
                }
            });

            // Add tags as JSON
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            submitData.append('tags', JSON.stringify(tagsArray));

            // Add agenda as JSON
            const agendaArray = formData.agenda.filter(item => item.trim() !== '');
            submitData.append('agenda', JSON.stringify(agendaArray));

            // Add image file
            const imageFile = fileInputRef.current?.files?.[0];
            if (imageFile) {
                submitData.append('image', imageFile);
            } else {
                setError('Please select an event image');
                setIsSubmitting(false);
                return;
            }

            const response = await fetch('/api/events', {
                method: 'POST',
                body: submitData,
            });

            const result = await response.json();

            if (result.success) {
                router.push(`/events/${result.data.slug}`);
                router.refresh();
            } else {
                setError(result.error || 'Failed to create event');
            }
        } catch (err) {
            console.error('Error creating event:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-12 pb-20">
            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Hero Section / Image Upload */}
            <div className="relative group">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full aspect-[21/9] rounded-2xl border-2 border-dashed border-dark-200 bg-dark-100 flex-center cursor-pointer overflow-hidden transition-all hover:border-primary/50 ${previewImage ? 'border-none' : ''}`}
                >
                    {previewImage ? (
                        <>
                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex-center transition-opacity">
                                <p className="text-white flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                    <Camera size={20} />
                                    Change Cover Image
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="bg-dark-200 p-4 rounded-full w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                                <Camera size={32} className="text-light-200 group-hover:text-primary transition-colors" />
                            </div>
                            <div>
                                <p className="text-lg font-medium text-light-100">Upload Cover Image</p>
                                <p className="text-sm text-light-200 mt-1">Recommended size: 1200x500px</p>
                            </div>
                        </div>
                    )}
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className="hidden" 
                />
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-primary border-b border-dark-200 pb-2">
                            <Plus size={20} />
                            <h2 className="text-xl font-bold uppercase tracking-wider">Event Details</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-light-200">Event Title</label>
                                <input 
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Next.js Conf 2026"
                                    className="bg-dark-100 border border-dark-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white text-lg font-semibold"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-light-200">URL Slug</label>
                                <div className="flex items-center gap-2 text-light-200 font-mono text-xs bg-dark-200/50 p-2 rounded border border-dark-200">
                                    <span>/events/</span>
                                    <input 
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        placeholder="event-slug"
                                        className="bg-transparent focus:outline-none text-white w-full"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-light-200">Short Description</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="A brief summary for cards and social sharing..."
                                    className="bg-dark-100 border border-dark-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-light-100 min-h-[100px] resize-none"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-light-200">Event Overview</label>
                                <textarea 
                                    name="overview"
                                    value={formData.overview}
                                    onChange={handleInputChange}
                                    placeholder="Detailed information about the event, what to expect, etc."
                                    className="bg-dark-100 border border-dark-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-light-100 min-h-[150px] resize-none"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-primary border-b border-dark-200 pb-2">
                            <Calendar size={20} />
                            <h2 className="text-xl font-bold uppercase tracking-wider">Schedule & Venue</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-light-200 flex items-center gap-2">
                                    <Calendar size={14} /> Date
                                </label>
                                <input 
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="bg-dark-100 border border-dark-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-light-200 flex items-center gap-2">
                                    <Clock size={14} /> Time
                                </label>
                                <input 
                                    name="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    className="bg-dark-100 border border-dark-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-light-200 flex items-center gap-2">
                                    <Globe size={14} /> Mode
                                </label>
                                <select 
                                    name="mode"
                                    value={formData.mode}
                                    onChange={handleInputChange}
                                    className="bg-dark-100 border border-dark-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white appearance-none"
                                    required
                                >
                                    <option value="offline">Offline (In-person)</option>
                                    <option value="online">Online (Virtual)</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-light-200 flex items-center gap-2">
                                    <MapPin size={14} /> Venue Name
                                </label>
                                <input 
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Google HQ"
                                    className="bg-dark-100 border border-dark-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-light-200 flex items-center gap-2">
                                <MapPin size={14} /> Full Address / Location
                            </label>
                            <input 
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="e.g. 1600 Amphitheatre Pkwy, Mountain View, CA"
                                className="bg-dark-100 border border-dark-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white"
                                required
                            />
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-primary border-b border-dark-200 pb-2">
                            <Clock size={20} />
                            <h2 className="text-xl font-bold uppercase tracking-wider">Agenda</h2>
                        </div>
                        
                        <div className="space-y-3">
                            {formData.agenda.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <input 
                                        value={item}
                                        onChange={(e) => handleAgendaChange(index, e.target.value)}
                                        placeholder={`Agenda item #${index + 1}`}
                                        className="flex-1 bg-dark-100 border border-dark-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors text-light-100"
                                        required
                                    />
                                    {formData.agenda.length > 1 && (
                                        <button 
                                            type="button"
                                            onClick={() => removeAgendaItem(index)}
                                            className="p-2 text-light-200 hover:text-destructive transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button 
                                type="button"
                                onClick={addAgendaItem}
                                className="flex items-center gap-2 text-primary text-sm font-medium hover:underline pt-2"
                            >
                                <Plus size={16} /> Add another item
                            </button>
                        </div>
                    </section>
                </div>

                {/* Right Column: Meta Info */}
                <div className="space-y-10">
                    <section className="bg-dark-100 border border-dark-200 rounded-xl p-6 space-y-6">
                        <div className="flex items-center gap-2 text-primary">
                            <Users size={20} />
                            <h2 className="text-lg font-bold uppercase tracking-wider">Organizer Info</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-light-200 uppercase tracking-widest">Organizer Name</label>
                                <input 
                                    name="organizer"
                                    value={formData.organizer}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Google Developers"
                                    className="bg-dark-200 border border-dark-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-white"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-light-200 uppercase tracking-widest">Target Audience</label>
                                <input 
                                    name="audience"
                                    value={formData.audience}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Developers, Students"
                                    className="bg-dark-200 border border-dark-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-white"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-dark-100 border border-dark-200 rounded-xl p-6 space-y-6">
                        <div className="flex items-center gap-2 text-primary">
                            <Tag size={20} />
                            <h2 className="text-lg font-bold uppercase tracking-wider">Tags</h2>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-light-200">Comma separated tags</label>
                            <input 
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder="e.g. Nextjs, React, Web3"
                                className="bg-dark-200 border border-dark-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-white"
                                required
                            />
                            <p className="text-[10px] text-light-200 italic mt-1 font-martian-mono">
                                Separate multiple tags with commas
                            </p>
                        </div>
                    </section>

                    <div className="sticky top-24 space-y-4">
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold text-black transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${isSubmitting ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:shadow-[0_0_20px_rgba(89,222,202,0.4)]'}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                                    Creating Event...
                                </>
                            ) : (
                                <>
                                    Publish Event
                                </>
                            )}
                        </button>
                        <button 
                            type="button"
                            onClick={() => router.back()}
                            className="w-full py-3 rounded-xl font-medium text-light-200 border border-dark-200 hover:bg-dark-100 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CreateEventForm;
