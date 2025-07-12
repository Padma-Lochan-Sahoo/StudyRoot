
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Heart, Lightbulb } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-uninote-dark">
                About{" "}
                <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
                  UniNote
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                We understand the struggle of hunting for quality study materials across different platforms. 
                UniNote was created to solve this problem by providing a centralized hub where students can 
                focus more on learning and less on searching.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission is simple: empower students with easy access to verified, high-quality study 
                materials so they can excel in their academic journey without the stress of resource hunting.
              </p>
            </div>

            <Button 
              size="lg"
              className="bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Join UniNote Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Right Column - Values Cards */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-uninote-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-uninote-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-uninote-dark mb-2">Our Mission</h3>
                  <p className="text-gray-600">
                    To democratize access to quality educational resources and help students achieve academic success.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-uninote-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-uninote-purple" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-uninote-dark mb-2">Our Values</h3>
                  <p className="text-gray-600">
                    Quality, accessibility, and student-first approach drive everything we do at UniNote.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-uninote-dark mb-2">Our Vision</h3>
                  <p className="text-gray-600">
                    To become the go-to platform for university students worldwide for all their academic needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
