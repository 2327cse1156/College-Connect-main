// import React from 'react';
import {  Briefcase, Code, MapPin, Calendar } from 'lucide-react';

const Profile = () => {
  const user = {
    name: 'Pravira Shukla',
    role: 'Computer Science Student',
    location: 'Ghaziabad',
    email: 'shukla.kiet@university.edu',
    joinDate: 'September 2023',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
    bio: 'Passionate about web development and machine learning. Always eager to collaborate on innovative projects and participate in hackathons.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <img
            src={user.image}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-lg text-gray-600">{user.role}</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {user.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                Member since {user.joinDate}
              </div>
            </div>
          </div>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-4">About Me</h2>
        <p className="text-gray-600">{user.bio}</p>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Activity Section */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <Code className="h-5 w-5 text-indigo-600 mt-1" />
            <div>
              <p className="font-medium">Participated in College Hackathon 2024</p>
              <p className="text-sm text-gray-600">Won 2nd place with project "EcoTrack"</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Briefcase className="h-5 w-5 text-indigo-600 mt-1" />
            <div>
              <p className="font-medium">Completed Summer Internship</p>
              <p className="text-sm text-gray-600">Software Engineer Intern at Tech Corp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;