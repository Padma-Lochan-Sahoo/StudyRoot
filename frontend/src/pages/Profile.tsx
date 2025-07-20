import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  GraduationCap, 
  Settings, 
  Activity, 
  Shield, 
  Trash2, 
  Camera, 
  Save, 
  Edit, 
  X,
  Download,
  Heart,
  Calendar,
  MapPin,
  Phone,
  Mail,
  BookOpen,
  Building,
  Hash,
  Globe
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axiosInstance";
import Navbar from "@/components/Navbar";

interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profilePic?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  location?: string;
  currentCourse?: string;
  currentSemester?: number;
  university?: string;
  studentId?: string;
  branch?: string;
  academicYear?: string;
  preferences?: {
    notifications: {
      email: boolean;
      downloads: boolean;
      courseUpdates: boolean;
    };
    theme: string;
    language: string;
    defaultCourse?: string;
  };
  activity?: {
    lastLogin: string;
    totalDownloads: number;
    favoriteNotes: any[];
    downloadHistory: any[];
  };
  profileCompletion: number;
  createdAt: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { authUser, logout } = useAuthStore();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    bio: "",
    location: "",
    currentCourse: "",
    currentSemester: "",
    university: "",
    studentId: "",
    branch: "",
    academicYear: "",
  });

  // Preferences states
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      downloads: true,
      courseUpdates: true,
    },
    theme: "light",
    language: "en",
    defaultCourse: "",
  });

  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete account states
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/profile");
      setProfile(response.data.data);
      setFormData({
        fullName: response.data.data.fullName || "",
        phoneNumber: response.data.data.phoneNumber || "",
        dateOfBirth: response.data.data.dateOfBirth ? new Date(response.data.data.dateOfBirth).toISOString().split('T')[0] : "",
        gender: response.data.data.gender || "",
        bio: response.data.data.bio || "",
        location: response.data.data.location || "",
        currentCourse: response.data.data.currentCourse || "",
        currentSemester: response.data.data.currentSemester?.toString() || "",
        university: response.data.data.university || "",
        studentId: response.data.data.studentId || "",
        branch: response.data.data.branch || "",
        academicYear: response.data.data.academicYear || "",
      });
      setPreferences(response.data.data.preferences || {
        notifications: { email: true, downloads: true, courseUpdates: true },
        theme: "light",
        language: "en",
        defaultCourse: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferencesChange = (field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Filter out empty strings and convert them to undefined for enum fields
      const cleanedFormData = {
        ...formData,
        phoneNumber: formData.phoneNumber || undefined,
        gender: formData.gender || undefined,
        bio: formData.bio || undefined,
        location: formData.location || undefined,
        currentCourse: formData.currentCourse || undefined,
        currentSemester: formData.currentSemester || undefined,
        university: formData.university || undefined,
        studentId: formData.studentId || undefined,
        branch: formData.branch || undefined,
        academicYear: formData.academicYear || undefined,
      };

      const response = await axios.put("/profile", cleanedFormData);
      setProfile(response.data.data);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      const response = await axios.put("/profile/preferences", preferences);
      setProfile(response.data.data);
      toast({
        title: "Success",
        description: "Preferences updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update preferences",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.put("/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/profile", { data: { password: deletePassword } });
      toast({
        title: "Success",
        description: "Account deleted successfully",
      });
      await logout();
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await axios.put("/profile/picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(response.data.data);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uninote-light via-white to-blue-50">
        <Navbar userName={authUser?.fullName || "Guest"} />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-uninote-blue"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uninote-light via-white to-blue-50">
        <Navbar userName={authUser?.fullName || "Guest"} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uninote-light via-white to-blue-50">
      <Navbar userName={authUser?.fullName || "Guest"} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.profilePic} alt={profile.fullName} />
                  <AvatarFallback className="bg-gradient-to-r from-uninote-blue to-uninote-purple text-white text-2xl">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50">
                  <Camera className="h-4 w-4 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile.fullName}</h1>
                <p className="text-gray-600 mb-2">{profile.email}</p>
                <div className="flex items-center space-x-4">
                  <Badge variant={profile.role === "admin" ? "default" : "secondary"}>
                    {profile.role}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Member since {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Profile Completion */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className="text-sm text-gray-500">{profile.profileCompletion}%</span>
                  </div>
                  <Progress value={profile.profileCompletion} className="h-2" />
                </div>
              </div>
              
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Academic</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange("gender", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Information Tab */}
          <TabsContent value="academic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>Update your academic details and course information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentCourse">Current Course</Label>
                    <Select
                      value={formData.currentCourse}
                      onValueChange={(value) => handleInputChange("currentCourse", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btech">B.Tech</SelectItem>
                        <SelectItem value="mca">MCA</SelectItem>
                        <SelectItem value="bca">BCA</SelectItem>
                        <SelectItem value="mba">MBA</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currentSemester">Current Semester</Label>
                    <Select
                      value={formData.currentSemester}
                      onValueChange={(value) => handleInputChange("currentSemester", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="university">University/College</Label>
                    <Input
                      id="university"
                      value={formData.university}
                      onChange={(e) => handleInputChange("university", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange("studentId", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch/Specialization</Label>
                    <Input
                      id="branch"
                      value={formData.branch}
                      onChange={(e) => handleInputChange("branch", e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., Computer Science, Electronics"
                    />
                  </div>
                  <div>
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input
                      id="academicYear"
                      value={formData.academicYear}
                      onChange={(e) => handleInputChange("academicYear", e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., 2023-24"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience and notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={preferences.notifications.email}
                        onCheckedChange={(checked) =>
                          handlePreferencesChange("notifications", {
                            ...preferences.notifications,
                            email: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Download Reminders</Label>
                        <p className="text-sm text-gray-500">Get notified about new notes</p>
                      </div>
                      <Switch
                        checked={preferences.notifications.downloads}
                        onCheckedChange={(checked) =>
                          handlePreferencesChange("notifications", {
                            ...preferences.notifications,
                            downloads: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Course Updates</Label>
                        <p className="text-sm text-gray-500">Notifications about course changes</p>
                      </div>
                      <Switch
                        checked={preferences.notifications.courseUpdates}
                        onCheckedChange={(checked) =>
                          handlePreferencesChange("notifications", {
                            ...preferences.notifications,
                            courseUpdates: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Theme</Label>
                      <Select
                        value={preferences.theme}
                        onValueChange={(value) => handlePreferencesChange("theme", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Language</Label>
                      <Select
                        value={preferences.language}
                        onValueChange={(value) => handlePreferencesChange("language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Default Settings</h3>
                  <div>
                    <Label>Default Course</Label>
                    <Select
                      value={preferences.defaultCourse}
                      onValueChange={(value) => handlePreferencesChange("defaultCourse", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select default course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btech">B.Tech</SelectItem>
                        <SelectItem value="mca">MCA</SelectItem>
                        <SelectItem value="bca">BCA</SelectItem>
                        <SelectItem value="mba">MBA</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSavePreferences} className="w-full">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Download className="h-8 w-8 text-uninote-blue mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{profile.activity?.totalDownloads || 0}</div>
                  <div className="text-gray-600">Total Downloads</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{profile.activity?.favoriteNotes?.length || 0}</div>
                  <div className="text-gray-600">Favorite Notes</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {profile.activity?.lastLogin ? 
                      new Date(profile.activity.lastLogin).toLocaleDateString() : 
                      "Never"
                    }
                  </div>
                  <div className="text-gray-600">Last Login</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Downloads</CardTitle>
                <CardDescription>Your recently downloaded notes</CardDescription>
              </CardHeader>
              <CardContent>
                {profile.activity?.downloadHistory?.length > 0 ? (
                  <div className="space-y-3">
                    {profile.activity.downloadHistory.slice(-5).reverse().map((download: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{download.noteId?.title || "Unknown Note"}</div>
                          <div className="text-sm text-gray-500">
                            {download.noteId?.course} • {download.noteId?.subject}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(download.downloadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Download className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No downloads yet</p>
                    <p className="text-sm">Start exploring notes to see your download history</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                  />
                </div>
                <Button onClick={handleChangePassword} className="w-full">
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Delete Account</CardTitle>
                <CardDescription>Permanently delete your account and all associated data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    <strong>Warning:</strong> This action cannot be undone. All your data, including download history, 
                    favorites, and profile information will be permanently deleted.
                  </p>
                </div>
                
                {!showDeleteConfirm ? (
                  <Button 
                    variant="destructive" 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="deletePassword">Enter your password to confirm</Label>
                      <Input
                        id="deletePassword"
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        className="flex-1"
                      >
                        Confirm Delete
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeletePassword("");
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile; 