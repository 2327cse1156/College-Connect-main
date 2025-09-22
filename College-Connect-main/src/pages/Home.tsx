// import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Code2, BookOpen, Network } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Users,
      title: 'Team Building',
      description: 'Find the perfect teammates for your next hackathon based on skills and interests.',
    },
    {
      icon: Code2,
      title: 'Hackathon Updates',
      description: 'Stay informed about upcoming hackathons and tech events.',
    },
    {
      icon: BookOpen,
      title: 'Resource Sharing',
      description: 'Access and share valuable learning resources with your college community.',
    },
    {
      icon: Network,
      title: 'Alumni Network',
      description: 'Connect with alumni for mentorship and career opportunities.',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Connect. Collaborate. Grow.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join your college community to find hackathon teammates, share resources, and build valuable connections.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/team-builder"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Find Teammates
          </Link>
          <Link
            to="/resources"
            className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
          >
            Browse Resources
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need to succeed
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
              <Icon className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-xl shadow-sm p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-indigo-600">500+</div>
            <div className="text-gray-600">Active Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600">200+</div>
            <div className="text-gray-600">Alumni Network</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600">50+</div>
            <div className="text-gray-600">Hackathons</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600">1000+</div>
            <div className="text-gray-600">Resources Shared</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;