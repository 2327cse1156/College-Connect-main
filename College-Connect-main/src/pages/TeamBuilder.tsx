import { useState } from 'react';
import { Search, Filter, Code2, MessageCircle } from 'lucide-react';

const TeamBuilder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const teamRequests = [
    {
      id: 1,
      title: 'Looking for Frontend Developer',
      event: 'College Tech Innovation Challenge',
      author: {
        name: 'Sarvendra Yadav',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      },
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      description: 'We need a frontend developer with experience in React and TypeScript for our hackathon project.',
      spots: 2,
      created: '2 hours ago',
    },
    {
      id: 2,
      title: 'Backend Developer Needed',
      event: 'Global Student Hackathon',
      author: {
        name: 'Ananya Srivastava',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      },
      skills: ['Node.js', 'PostgreSQL', 'REST APIs'],
      description: 'Looking for a backend developer who can help build a scalable API for our project.',
      spots: 1,
      created: '5 hours ago',
    },
    {
      id: 3,
      title: 'UI/UX Designer + Developer',
      event: 'AI & Machine Learning Challenge',
      author: {
        name: 'Alok Pal',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      },
      skills: ['Figma', 'React', 'UI Design'],
      description: 'Seeking someone who can handle both design and frontend implementation.',
      spots: 1,
      created: '1 day ago',
    },
    {
      id: 4,
      title: 'Machine Learning Developer',
      event: 'Innotech',
      author: {
        name: 'Riya Deshmankar',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      },
      skills: ['Node.js', 'PostgreSQL', 'REST APIs'],
      description: 'Looking for a Machine Learning developer who can help build a scalable API for our project.',
      spots: 1,
      created: '5 hours ago',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Team Builder</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find the perfect teammates for your next hackathon project.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by skills, roles, or hackathon..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </button>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Create Request
        </button>
      </div>

      {/* Team Requests */}
      <div className="space-y-6">
        {teamRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <img
                  src={request.author.image}
                  alt={request.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
                  <p className="text-gray-600">
                    Posted by {request.author.name} · {request.created}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                {request.spots} spot{request.spots !== 1 && 's'} left
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center text-gray-600 mb-2">
                <Code2 className="h-4 w-4 mr-2" />
                {request.event}
              </div>
              <p className="text-gray-600 mb-4">{request.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {request.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </button>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Apply to Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamBuilder;