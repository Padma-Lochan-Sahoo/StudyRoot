
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Download, Shield, CheckCircle } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Browse Notes by Course & Semester",
    description: "Easily navigate through organized course materials sorted by semester and subject for quick access to what you need.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Download,
    title: "Download Verified Study Materials",
    description: "Access high-quality, peer-reviewed notes and study materials that have been verified by our academic team.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "Secure Login & Dashboard Access",
    description: "Your personal dashboard with secure authentication keeps your study progress and bookmarks safe and synchronized.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: CheckCircle,
    title: "Admin-Verified Uploads",
    description: "Every piece of content goes through our quality assurance process to ensure accuracy and relevance for your studies.",
    gradient: "from-orange-500 to-red-500"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-uninote-dark mb-4">
            Platform{" "}
            <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to ace your studies, all in one platform designed specifically for university students.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
            >
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-uninote-dark group-hover:text-uninote-blue transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
              
              {/* Hover effect background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
