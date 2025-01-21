import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { 
  BookOpen, 
  Clock, 
  Video, 
  Star, 
  CheckCircle, 
  Award, 
  MessageSquare,
  Download,
  Trophy,
  Brain,
  X
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  duration: string;
  views: string;
  completed: boolean;
}

function App() {
  const [activeVideo, setActiveVideo] = useState("video1");
  const [videos, setVideos] = useState<Video[]>([
    { 
      id: "video1", 
      title: "Introduction to React Fundamentals", 
      duration: "15:30", 
      views: "1.2M", 
      completed: true 
    },
    { 
      id: "video2", 
      title: "Component Lifecycle and Hooks", 
      duration: "20:45", 
      views: "980K", 
      completed: false 
    },
    { 
      id: "video3", 
      title: "State Management Deep Dive", 
      duration: "25:15", 
      views: "750K", 
      completed: false 
    },
    { 
      id: "video4", 
      title: "Building Custom Hooks", 
      duration: "18:20", 
      views: "620K", 
      completed: false 
    },
  ]);
  const [note, setNote] = useState("");
  const [progress, setProgress] = useState(25);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== message));
    }, 3000);
  };

  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Set background color
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, 297, 210, 'F');

    // Add decorative border
    doc.setDrawColor(128, 90, 213); // Purple color
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    doc.setLineWidth(0.5);
    doc.rect(12, 12, 273, 186);

    // Add certificate title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(128, 90, 213);
    doc.text("Certificate of Completion", 148.5, 50, { align: "center" });

    // Add course name
    doc.setFontSize(24);
    doc.setTextColor(75, 85, 99);
    doc.text("Modern React Development", 148.5, 80, { align: "center" });

    // Add recipient name
    doc.setFontSize(28);
    doc.setTextColor(31, 41, 55);
    doc.text("Tushar Dev Singh", 148.5, 110, { align: "center" });

    // Add completion text
    doc.setFontSize(16);
    doc.setTextColor(75, 85, 99);
    doc.text("has successfully completed the course with all requirements", 148.5, 125, { align: "center" });

    // Add date
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Issued on ${date}`, 148.5, 140, { align: "center" });

    // Add HR signature
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("Tushar Dev Singh", 148.5, 170, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(118.5, 175, 178.5, 175);
    doc.setFontSize(12);
    doc.text("Human Resources", 148.5, 182, { align: "center" });

    // Save the PDF
    doc.save("Modern_React_Development_Certificate.pdf");
  };

  const toggleVideoCompletion = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up
    setVideos(prevVideos => {
      const updatedVideos = prevVideos.map(video => {
        if (video.id === videoId) {
          const newCompleted = !video.completed;
          if (newCompleted) {
            addNotification("Video marked as completed! 🎉");
          }
          return { ...video, completed: newCompleted };
        }
        return video;
      });
      
      // Calculate new progress after updating videos
      const completedCount = updatedVideos.filter(v => v.completed).length;
      const newProgress = (completedCount / updatedVideos.length) * 100;
      setProgress(newProgress);
      
      // Check if course is completed
      if (newProgress === 100) {
        addNotification("Congratulations! You've completed the course! 🎓");
      }
      
      return updatedVideos;
    });
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
    addNotification("Successfully enrolled in the course! 🚀");
  };

  const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 animate-slideIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification, index) => (
          <div 
            key={index}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slideInRight"
          >
            {notification}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Modern React Development</h1>
            <button 
              onClick={handleEnroll}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                isEnrolled 
                  ? 'bg-green-500 text-white cursor-default'
                  : 'bg-white text-purple-600 hover:bg-gray-100'
              }`}
            >
              {isEnrolled ? 'Enrolled ✓' : 'Enroll Now'}
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-6 mt-8">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>Intermediate Level</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>4 Hours Total</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              <span>{videos.length} Videos</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-current" />
              <span>4.8/5 (2.3k reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Video Player and Notes */}
          <div className="col-span-2 space-y-6">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/dQw4w9WgXcQ`}
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>

            {/* AI Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI-Generated Summary
              </h2>
              <p className="text-gray-600">
                This video covers the fundamental concepts of React development, including component structure,
                JSX syntax, and state management. Key takeaways include understanding the virtual DOM,
                component lifecycle, and best practices for modern React applications.
              </p>
            </div>

            {/* Notes Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4">Personal Notes</h2>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Add your notes here..."
              ></textarea>
            </div>

            {/* Practice Questions */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI-Generated Practice Questions
              </h2>
              <ul className="space-y-4">
                <li className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <p className="font-medium">What is the primary purpose of React's virtual DOM?</p>
                </li>
                <li className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <p className="font-medium">How does React handle component re-rendering?</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4">Course Progress</h2>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                <div 
                  className="bg-purple-600 rounded-full h-4 transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-gray-600">{Math.round(progress)}% Complete</p>
            </div>

            {/* Video List */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4">Course Content</h2>
              <div className="space-y-4">
                {videos.map((video) => (
                  <div 
                    key={video.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                      activeVideo === video.id ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveVideo(video.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={(e) => toggleVideoCompletion(video.id, e)}
                          className={`mt-1 transition-colors duration-300 ${video.completed ? 'text-green-500' : 'text-gray-400'}`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <div>
                          <h3 className="font-medium">{video.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {video.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Video className="w-4 h-4" />
                              {video.views} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Features */}
            <div className="space-y-4">
              {/* Achievements */}
              <button 
                onClick={() => setShowAchievements(true)}
                className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
              >
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">View Achievements</span>
              </button>

              {/* Community */}
              <button 
                onClick={() => setShowDiscussion(true)}
                className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
              >
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Join Discussion</span>
              </button>

              {/* Certificate */}
              <button 
                onClick={() => progress === 100 ? setShowCertificate(true) : addNotification("Complete the course to get your certificate! 📚")}
                className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
              >
                <Award className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Get Certificate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAchievements && (
        <Modal title="Your Achievements" onClose={() => setShowAchievements(false)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div>
                <h3 className="font-medium">First Video Completed</h3>
                <p className="text-sm text-gray-500">Started your learning journey</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Star className="w-6 h-6 text-yellow-500" />
              <div>
                <h3 className="font-medium">Quick Learner</h3>
                <p className="text-sm text-gray-500">Completed 25% of the course</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {showDiscussion && (
        <Modal title="Course Discussion" onClose={() => setShowDiscussion(false)}>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Join the conversation</h3>
              <p className="text-sm text-gray-600">
                Connect with fellow learners, ask questions, and share your insights about the course.
              </p>
            </div>
            <div className="space-y-2">
              <textarea 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Write your message..."
                rows={3}
              ></textarea>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Post Message
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showCertificate && (
        <Modal title="Course Certificate" onClose={() => setShowCertificate(false)}>
          <div className="text-center space-y-4">
            <Award className="w-16 h-16 text-purple-500 mx-auto" />
            <h3 className="font-medium text-xl">Congratulations!</h3>
            <p className="text-gray-600">
              You've successfully completed the Modern React Development course.
            </p>
            <button 
              onClick={generateCertificate}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Download className="w-5 h-5" />
              Download Certificate
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default App;