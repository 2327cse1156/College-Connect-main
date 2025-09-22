// import React from 'react';
import { Search, MessageCircle, Code2, Users } from 'lucide-react';

const Seniors = () => {
  const seniors = [
    {
      id: 1,
      name: 'Abhay Shukla',
      major: 'Computer Science',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      skills: ['React', 'Node.js', 'Python'],
      interests: ['Web Development', 'Machine Learning'],
      achievements: ['Hackathon Winner 2023', 'Research Assistant'],
      available: true,
    },
    {
      id: 2,
      name: 'Prapti Sharma',
      major: 'Software Engineering',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      skills: ['Java', 'Spring Boot', 'AWS'],
      interests: ['Cloud Computing', 'System Design'],
      achievements: ['Tech Lead - College Project', 'Summer Internship at Amazon','GSoC 2k24'],
      available: true,
    },
    {
      id: 3,
      name: 'Shreyansh Tiwari',
      major: 'Computer Science Engineering',
      image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      skills: ['C++', 'CUDA', 'TensorFlow'],
      interests: ['GPU Programming', 'Deep Learning'],
      achievements: ['Research Paper Publication', 'Department Award'],
      available: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Connect with Seniors</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Learn from experienced seniors and get guidance for your academic journey.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, skills, or interests..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select className="px-4 py-2 border rounded-lg">
          <option>All Majors</option>
          <option>Computer Science</option>
          <option>Software Engineering</option>
          <option>Computer Engineering</option>
        </select>
        <select className="px-4 py-2 border rounded-lg">
          <option>All Skills</option>
          <option>Web Development</option>
          <option>Machine Learning</option>
          <option>Cloud Computing</option>
        </select>
      </div>

      {/* Seniors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seniors.map((senior) => (
          <div key={senior.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <img
                src={senior.image}
                alt={senior.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{senior.name}</h3>
                <p className="text-gray-600">{senior.major}</p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {senior.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {senior.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Achievements</h4>
                <ul className="space-y-1">
                  {senior.achievements.map((achievement) => (
                    <li key={achievement} className="text-sm text-gray-600">
                      • {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <span className={`text-sm ${
                senior.available ? 'text-green-600' : 'text-gray-500'
              }`}>
                {senior.available ? '● Available for mentoring' : '○ Currently unavailable'}
              </span>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="flex items-center justify-center space-x-2 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
          <MessageCircle className="h-6 w-6 text-indigo-600" />
          <span className="font-medium">Ask for Guidance</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
          <Code2 className="h-6 w-6 text-indigo-600" />
          <span className="font-medium">Join Project Teams</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
          <Users className="h-6 w-6 text-indigo-600" />
          <span className="font-medium">Study Groups</span>
        </button>
      </div>
    </div>
  );
};

export default Seniors;