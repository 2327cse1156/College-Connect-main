// import React from 'react';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';

const Hackathons = () => {
  const hackathons = [
    {
      id: 1,
      title: 'Innotech',
      date: 'Nov 30, 2024',
      location: 'Main Campus',
      type: 'In-Person',
      participants: '2000+',
      prizes: '$5000',
      image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      registrationOpen: true,
    },
    {
      id: 2,
      title: 'Gen AI Hackathon',
      date: 'April 5-7, 2024',
      location: 'Virtual',
      type: 'Offline',
      participants: '1000+',
      prizes: '$10000',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      registrationOpen: false,
    },
    {
      id: 3,
      title: 'NASA Space Challenge',
      date: 'May 20-22, 2024',
      location: 'Engineering Building',
      type: 'Hybrid',
      participants: '150+',
      prizes: '$3000',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      registrationOpen: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Upcoming Hackathons</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover upcoming hackathons, form teams, and showcase your skills.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap gap-4">
        <select className="px-4 py-2 border rounded-lg text-gray-700">
          <option>All Types</option>
          <option>In-Person</option>
          <option>Online</option>
          <option>Hybrid</option>
        </select>
        <select className="px-4 py-2 border rounded-lg text-gray-700">
          <option>All Locations</option>
          <option>On Campus</option>
          <option>Virtual</option>
        </select>
        <select className="px-4 py-2 border rounded-lg text-gray-700">
          <option>Registration Status</option>
          <option>Open</option>
          <option>Closed</option>
        </select>
      </div>

      {/* Hackathon List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hackathons.map((hackathon) => (
          <div key={hackathon.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <img
              src={hackathon.image}
              alt={hackathon.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">{hackathon.title}</h3>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {hackathon.date}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {hackathon.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {hackathon.participants} participants expected
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-600">
                  Prize Pool: {hackathon.prizes}
                </span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  hackathon.registrationOpen
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {hackathon.registrationOpen ? 'Registration Open' : 'Registration Closed'}
                </span>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Register Now
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <ExternalLink className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hackathons;