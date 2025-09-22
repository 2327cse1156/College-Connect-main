// import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">CollegeConnect</h3>
            <p className="text-gray-600">
            Find Your Perfect Hackathon Teammate. Connect. Collaborate. Succeed.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/alumni" className="text-gray-600 hover:text-indigo-600">Alumni Network</a></li>
              <li><a href="/events" className="text-gray-600 hover:text-indigo-600">Upcoming Events</a></li>
              <li><a href="/resources" className="text-gray-600 hover:text-indigo-600">Resources</a></li>
              <li><a href="/hackathon-teams" className="text-gray-600 hover:text-indigo-600">Find Teams</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-indigo-600">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-indigo-600">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-indigo-600">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} CollegeConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;