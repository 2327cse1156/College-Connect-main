import  { useState } from 'react';
import { Search, BookOpen, ThumbsUp, Download, Share2 } from 'lucide-react';

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const resources = [
    {
      id: 1,
      title: 'Complete Web Development Guide 2024',
      type: 'PDF',
      author: {
        name: 'David Lee',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      },
      category: 'Web Development',
      likes: 245,
      downloads: 1200,
      description: 'A comprehensive guide covering modern web development technologies and best practices.',
      tags: ['JavaScript', 'React', 'Node.js'],
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      type: 'Video Course',
      author: {
        name: 'Sarah Wilson',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      },
      category: 'Machine Learning',
      likes: 189,
      downloads: 850,
      description: 'Learn the basics of machine learning with practical examples and projects.',
      tags: ['Python', 'TensorFlow', 'Data Science'],
    },
    {
      id: 3,
      title: 'System Design Interview Preparation',
      type: 'Document',
      author: {
        name: 'Mike Chen',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      },
      category: 'Interview Prep',
      likes: 312,
      downloads: 1500,
      description: 'Essential concepts and examples for system design interviews at <boltAction type="file" filePath="src/pages/Resources.tsx"> tech companies.',
      tags: ['System Design', 'Architecture', 'Scalability'],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Learning Resources</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Access and share valuable learning materials with your college community.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select className="px-4 py-2 border rounded-lg">
          <option>All Categories</option>
          <option>Web Development</option>
          <option>Machine Learning</option>
          <option>Interview Prep</option>
        </select>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Share Resource
        </button>
      </div>

      {/* Resources List */}
      <div className="space-y-6">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{resource.title}</h3>
                  <p className="text-gray-600">
                    by {resource.author.name} · {resource.type}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                {resource.category}
              </span>
            </div>

            <p className="mt-4 text-gray-600">{resource.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex space-x-6">
                <button className="flex items-center text-gray-600 hover:text-indigo-600">
                  <ThumbsUp className="h-5 w-5 mr-1" />
                  {resource.likes}
                </button>
                <button className="flex items-center text-gray-600 hover:text-indigo-600">
                  <Download className="h-5 w-5 mr-1" />
                  {resource.downloads}
                </button>
                <button className="flex items-center text-gray-600 hover:text-indigo-600">
                  <Share2 className="h-5 w-5 mr-1" />
                  Share
                </button>
              </div>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;