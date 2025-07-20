
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, LogOut, User, BookOpen, Code, Building, Briefcase, MoreHorizontal, Trash2 } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createSession, joinSession, getUserSessions, deleteSession } from "@/lib/collabNotesApi";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const courses = [
  {
    id: "btech",
    title: "B.Tech",
    fullForm: "Bachelor of Technology",
    description: "Engineering courses",
    semesters: 8,
    icon: Code,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "mca",
    title: "MCA",
    fullForm: "Master of Computer Applications",
    description: "Computer Applications",
    semesters: 4,
    icon: BookOpen,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "bca",
    title: "BCA",
    fullForm: "Bachelor of Computer Applications",
    description: "Computer Applications",
    semesters: 6,
    icon: Building,
    color: "from-green-500 to-teal-500"
  },
  {
    id: "mba",
    title: "MBA",
    fullForm: "Master of Business Administration",
    description: "Business Administration",
    semesters: 4,
    icon: Briefcase,
    color: "from-orange-500 to-red-500"
  },
  {
    id: "others",
    title: "Others",
    fullForm: "Additional Courses",
    description: "Additional programs",
    semesters: 6,
    icon: MoreHorizontal,
    color: "from-gray-500 to-slate-500"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Modal state
  const [openCreate, setOpenCreate] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);

  // Form state (placeholders)
  const [noteTitle, setNoteTitle] = useState("");
  const [inviteEmails, setInviteEmails] = useState("");
  const [joinCode, setJoinCode] = useState("");

  // State for Show More toggle and search
  const [showMore, setShowMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      setLoadingSessions(true);
      try {
        const res = await getUserSessions();
        setSessions(res.sessions || []);
      } catch (err: any) {
        setSessions([]);
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchSessions();
  }, []);

  // Filter sessions by search query
  const filteredSessions = sessions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Handle create session
  const handleCreateSession = async () => {
    try {
      const emails = inviteEmails.split(",").map(e => e.trim()).filter(Boolean);
      const res = await createSession(noteTitle, emails);
      toast({ title: "Session Created!", description: `Session code: ${res.session.sessionCode}` });
      setOpenCreate(false);
      setNoteTitle("");
      setInviteEmails("");
      setSessions([res.session, ...sessions]);
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to create session", variant: "destructive" });
    }
  };

  // Handle join session
  const handleJoinSession = async () => {
    try {
      const res = await joinSession(joinCode);
      toast({ title: "Joined Session!", description: `Session: ${res.session.title}` });
      setOpenJoin(false);
      setJoinCode("");
      // Optionally add to sessions list
      if (!sessions.find(s => s._id === res.session._id)) {
        setSessions([res.session, ...sessions]);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to join session", variant: "destructive" });
    }
  };

  // Handle delete session
  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSession(id);
      setSessions(sessions.filter(s => s._id !== id));
      toast({ title: "Session deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to delete session", variant: "destructive" });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-uninote-light via-white to-blue-50">
      {/* Navigation */}
      <Navbar userName={authUser?.fullName || "Guest"} />


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to Your{" "}
            <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
              Study Hub
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your course to access semester-wise notes and study materials.
            Everything you need for academic success, organized and ready to download.
          </p>
        </div>




        {/* Real-Time Collaborative Notes Card */}
        <div className="mb-10">
          <div className="bg-white/90 shadow-xl rounded-2xl p-8 flex flex-col gap-6 border-l-8 border-uninote-blue">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-uninote-blue mb-1">Real-Time Collaborative Notes</h2>
                <p className="text-gray-600 max-w-xl">Create or join a collaborative note session to edit notes in real time with your peers. Invite others by email and work together instantly!</p>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Button className="bg-gradient-to-r from-uninote-blue to-uninote-purple text-white font-semibold rounded-xl px-6 py-3 text-lg shadow-md hover:from-uninote-purple hover:to-uninote-blue transition-all duration-300" onClick={() => setOpenCreate(true)}>
                  Create Note Session
                </Button>
                <Button variant="outline" className="border-uninote-blue text-uninote-blue font-semibold rounded-xl px-6 py-3 text-lg shadow-md hover:bg-uninote-blue/10 transition-all duration-300" onClick={() => setOpenJoin(true)}>
                  Join Note Session
                </Button>
              </div>
            </div>
            {/* Previous Sessions Section (placeholder) */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Previous Collaborative Note Sessions</h3>
              <div className="mb-4 max-w-xs">
                <Input
                  placeholder="Search sessions by title..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              {filteredSessions.length === 0 ? (
                <div className="bg-gray-50 border-l-4 border-uninote-purple rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-uninote-purple">No sessions found.</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Latest session at the top */}
                  <div className="bg-gray-50 border-l-4 border-uninote-purple rounded-lg p-4 flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-uninote-purple">{filteredSessions[0].title}</span>
                      <span className="ml-4 text-xs text-gray-500">Code: {filteredSessions[0].sessionCode}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-uninote-purple text-uninote-purple" onClick={() => navigate(`/collab-note/${filteredSessions[0]._id}`)}>
                        Open
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteSession(filteredSessions[0]._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {/* Show More toggle for older sessions */}
                  {filteredSessions.length > 1 && (
                    <>
                      {!showMore ? (
                        <Button variant="ghost" className="text-uninote-purple mb-2" onClick={() => setShowMore(true)}>
                          Show More
                        </Button>
                      ) : (
                        <>
                          {filteredSessions.slice(1).map(session => (
                            <div key={session._id} className="bg-gray-50 border-l-4 border-uninote-purple rounded-lg p-4 flex items-center justify-between mb-2">
                              <div>
                                <span className="font-semibold text-uninote-purple">{session.title}</span>
                                <span className="ml-4 text-xs text-gray-500">Code: {session.sessionCode}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="border-uninote-purple text-uninote-purple" onClick={() => navigate(`/collab-note/${session._id}`)}>
                                  Open
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteSession(session._id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button variant="ghost" className="text-uninote-purple" onClick={() => setShowMore(false)}>
                            Show Less
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Create Note Session Modal */}
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Collaborative Note Session</DialogTitle>
              <DialogDescription>Start a new real-time note session and invite collaborators by email.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Note Title"
                value={noteTitle}
                onChange={e => setNoteTitle(e.target.value)}
              />
              <Input
                placeholder="Invite collaborators (comma-separated emails)"
                value={inviteEmails}
                onChange={e => setInviteEmails(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={handleCreateSession}>Create Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Join Note Session Modal */}
        <Dialog open={openJoin} onOpenChange={setOpenJoin}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join Collaborative Note Session</DialogTitle>
              <DialogDescription>Enter the session code you received to join a collaborative note session.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Session Code"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={handleJoinSession}>Join Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const IconComponent = course.icon;
            return (
              <Card
                key={course.id}
                className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                onClick={() => navigate(`/dashboard/${course.id}`)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${course.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 group-hover:text-uninote-blue transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    {course.fullForm}
                  </CardDescription>
                  <div className="text-sm text-gray-500 mt-2">
                    {course.semesters} Semesters
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    className="w-full bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue text-white font-medium rounded-xl transition-all duration-300"
                  >
                    View Semesters
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <StatsCard />
      </div>
    </div>
  );
};

export default Dashboard;