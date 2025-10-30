// src/components/Footer.tsx
import { Github, Linkedin, Twitter, ArrowUp, Mail, Heart, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-20">
      {/* Background gradient matching home page */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CollegeConnect
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Empowering students to connect, collaborate, and succeed together. Your journey starts here.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:shadow-md transition-all duration-300 border border-gray-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:shadow-md transition-all duration-300 border border-gray-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:shadow-md transition-all duration-300 border border-gray-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-gray-900 font-semibold text-lg mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/team-builder"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></span>
                  Team Builder
                </Link>
              </li>
              <li>
                <Link
                  to="/hackathons"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></span>
                  Hackathons
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></span>
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/alumni"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></span>
                  Alumni Network
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="text-gray-900 font-semibold text-lg mb-4">Community</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/events"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></span>
                  Events
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></span>
                  Success Stories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></span>
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></span>
                  Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-gray-900 font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-indigo-600 transition-colors"></span>
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@collegeconnect.com"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <Mail className="h-3 w-3 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 text-center md:text-left">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-indigo-600">CollegeConnect</span>
            . All rights reserved.
          </p>
          
          <p className="text-sm text-gray-600 flex items-center gap-2">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by students, for students
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </footer>
  );
};

export default Footer;