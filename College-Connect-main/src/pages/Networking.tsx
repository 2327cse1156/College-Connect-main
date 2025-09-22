// import React from 'react';
import { UserCircle, Briefcase, MessageCircle, Calendar, Users } from 'lucide-react';

const Networking = () => {
  const alumni = [
    {
      id: 1,
      name: 'Jennifer Wong',
      role: 'Senior Software Engineer',
      company: 'Google',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      expertise: ['Web Development', 'System Design', 'Cloud Architecture'],
      available: true,
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'Microsoft',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      expertise: ['Product Strategy', 'Agile', 'Tech Leadership'],
      available: true,
    },
    {
      id: 3,
      name: 'Sarah Park',
      role: 'ML Engineer',
      company: 'Tesla',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      expertise: ['Machine Learning', 'Computer Vision', 'Python'],
      available: false,
    },
  ];

  const events = [
    {
      id: 1,
      title: 'Alumni Tech Talk: Career in Silicon Valley',
      date: 'March 20, 2024',
      time: '6:00 PM PST',
      type: 'Virtual',
      speaker: 'Jennifer Wong',
      attendees: 45,
    },
    {
      id: 2,
      title: 'Mock Interview Session',
      date: 'March 25, 2024',
      time: '4:00 PM PST',
      type: 'In-Person',
      speaker: 'Michael Chen',
      attendees: 12,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Alumni Network</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect with alumni for mentorship, career advice, and networking opportunities.
        </p>
      </div>

      {/* Featured Alumni */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Alumni</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map((person) => (
            <div key={person.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                  <p className="text-gray-600">{person.role}</p>
                  <p className="text-gray-600">{person.company}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {person.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <span className={`text-sm ${
                  person.available ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {person.available ? '● Available for mentoring' : '○ Currently unavailable'}
                </span>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Networking Events</h2>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <UserCircle className="h-4 w-4 mr-2" />
                      Speaker: {event.speaker}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {event.attendees} attending
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  event.type === 'Virtual'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {event.type}
                </span>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Learn More
                </button>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="flex items-center justify-center space-x-2 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
          <MessageCircle className="h-6 w-6 text-indigo-600" />
          <span className="font-medium">Message Alumni</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
          <Briefcase className="h-6 w-6 text-indigo-600" />
          <span className="font-medium">Browse Job Referrals</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
          <Calendar className="h-6 w-6 text-indigo-600" />
          <span className="font-medium">Schedule Mentoring</span>
        </button>
      </section>
    </div>
  );
};

export default Networking;