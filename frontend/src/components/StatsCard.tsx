
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Download, GraduationCap } from "lucide-react";

const StatsCard = () => {
  const stats = [
    {
      label: "Total Courses",
      value: "5",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500"
    },
    {
      label: "Total Notes Available",
      value: "320",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500"
    },
    {
      label: "Total Downloads",
      value: "5,200",
      icon: Download,
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={index}
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <IconComponent className="h-6 w-6 text-white" />     
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCard;
