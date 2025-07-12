
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BookOpen, Users, Award, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-uninote-light via-white to-blue-50 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-uninote-blue to-uninote-purple rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-uninote-purple to-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-blue-300 to-uninote-blue rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#3B82F6'}} />
              <stop offset="100%" style={{stopColor: '#8B5CF6'}} />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" stroke="url(#gridGradient)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-uninote-dark leading-tight mb-6">
              All Your University Notes,{" "}
              <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
                One Click Away
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              UniNote helps students access semester-wise and subject-wise notes easily. 
              From B.Tech to MBA – everything you need is here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-uninote-blue text-uninote-blue hover:bg-uninote-blue hover:text-white px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-uninote-blue mb-1">10K+</div>
                <div className="text-gray-600 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-uninote-purple mb-1">500+</div>
                <div className="text-gray-600 text-sm">Notes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-uninote-blue mb-1">50+</div>
                <div className="text-gray-600 text-sm">Subjects</div>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Illustration */}
          <div className="relative animate-slide-in-right">
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              {/* Mock App Interface with Glassmorphism */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/30">
                {/* Header */}
                <div className="bg-gradient-to-r from-uninote-blue to-uninote-purple p-4 text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold mt-4">UniNote Dashboard</h3>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200/50">
                      <BookOpen className="h-8 w-8 text-uninote-blue mb-2" />
                      <div className="text-sm font-semibold text-gray-800">B.Tech</div>
                      <div className="text-xs text-gray-600">Engineering</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200/50">
                      <Users className="h-8 w-8 text-uninote-purple mb-2" />
                      <div className="text-sm font-semibold text-gray-800">MCA</div>
                      <div className="text-xs text-gray-600">Computer Apps</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200/50">
                      <div className="w-2 h-2 bg-uninote-blue rounded-full"></div>
                      <span className="text-sm text-gray-700">Data Structures</span>
                      <div className="ml-auto text-xs text-gray-500">PDF</div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200/50">
                      <div className="w-2 h-2 bg-uninote-purple rounded-full"></div>
                      <span className="text-sm text-gray-700">Database Systems</span>
                      <div className="ml-auto text-xs text-gray-500">PDF</div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Operating Systems</span>
                      <div className="ml-auto text-xs text-gray-500">PDF</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30 animate-float">
              <Award className="h-8 w-8 text-uninote-blue" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30 animate-float" style={{animationDelay: '1s'}}>
              <Shield className="h-8 w-8 text-uninote-purple" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
