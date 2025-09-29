// src/components/Footer.tsx
import { Github, Linkedin, Twitter, ArrowUp } from "lucide-react";

import { useEffect, useState } from "react";

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
    <footer className="bg-gray-50 border-t relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-indigo-600">CollegeConnect</h3>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              Find your perfect hackathon teammate. <br /> Connect. Collaborate.
              Succeed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/alumni"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Alumni Network
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Upcoming Events
                </a>
              </li>
              <li>
                <a
                  href="/resources"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Resources
                </a>
              </li>
              <li>
                <a
                  href="/hackathon-teams"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Find Teams
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Connect With Us
            </h3>
            <div className="flex justify-center md:justify-start space-x-5">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-indigo-600">
              CollegeConnect
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
