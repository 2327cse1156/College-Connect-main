import { Link } from "react-router-dom";
import { Users, Code2, BookOpen, Network } from "lucide-react";
import { motion } from "framer-motion";
import { FC } from "react";

interface FeatureCardProps {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
  >
    <Icon className="h-12 w-12 text-indigo-600 mb-4" />
    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
      {title}
    </h3>
    <p className="text-sm md:text-base text-gray-600">{description}</p>
  </motion.div>
);

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard: FC<StatCardProps> = ({ value, label }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center"
  >
    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600">
      {value}
    </div>
    <div className="text-gray-600 text-sm sm:text-base">{label}</div>
  </motion.div>
);

const features = [
  {
    icon: Users,
    title: "Team Building",
    description:
      "Find the perfect teammates for your next hackathon based on skills and interests.",
  },
  {
    icon: Code2,
    title: "Hackathon Updates",
    description: "Stay informed about upcoming hackathons and tech events.",
  },
  {
    icon: BookOpen,
    title: "Resource Sharing",
    description:
      "Access and share valuable learning resources with your college community.",
  },
  {
    icon: Network,
    title: "Alumni Network",
    description: "Connect with alumni for mentorship and career opportunities.",
  },
];

const stats = [
  { label: "Active Students", value: "500+" },
  { label: "Alumni Network", value: "200+" },
  { label: "Hackathons", value: "50+" },
  { label: "Resources Shared", value: "1000+" },
];

const Home: FC = () => {
  return (
    <div className="space-y-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className="text-center space-y-6 sm:space-y-8 pt-20"
      >
        <h1
          id="hero-heading"
          className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900"
        >
          Connect. Collaborate. Grow.
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Join your college community to find hackathon teammates, share
          resources, and build valuable connections.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Link
            to="/team-builder"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
          >
            Find Teammates
          </Link>
          <Link
            to="/resources"
            className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition text-sm sm:text-base"
          >
            Browse Resources
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section aria-labelledby="features-heading">
        <h2
          id="features-heading"
          className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12"
        >
          Everything you need to succeed
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <FeatureCard
              key={title}
              Icon={Icon}
              title={title}
              description={description}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section
        aria-labelledby="stats-heading"
        className="bg-white rounded-xl shadow-sm p-6 sm:p-8 md:p-12"
      >
        <h2 id="stats-heading" className="sr-only">
          Community Statistics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
          {stats.map(({ value, label }) => (
            <StatCard key={label} value={value} label={label} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
