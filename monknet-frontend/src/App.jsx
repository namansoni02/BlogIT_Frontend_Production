import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginBox from "./components/auth/LoginBox";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import UsersPage from "./pages/UsersPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginBox />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
    </Routes>
  );  
}

// // TESTING DISPLAY - PostBox and UserStatsBox Components
// import PostBox from "./components/post/postBox";
// import UserStatsBox from "./components/post/userStatsBox";

// export default function App() {
//   // Sample user stats data
//   const sampleUserStats = {
//     followers: 1234,
//     following: 567,
//     posts: 89,
//     likes: 4567,
//     views: 12345
//   };

//   // Sample posts data
//   const samplePosts = [
//     {
//       author: "John Doe",
//       timestamp: "2 hours ago",
//       title: "Getting Started with React",
//       content: "React has been an amazing journey! Here are some tips for beginners: Start with functional components, learn hooks early, and practice building small projects. The component-based architecture makes it so much easier to build scalable applications. 🚀",
//       likes: 42,
//       comments: 8,
//       shares: 3
//     },
//     {
//       author: "Jane Smith",
//       timestamp: "5 hours ago",
//       content: "Just deployed my first full-stack application! Feeling accomplished and excited to share it with the community. Thanks to everyone who helped me along the way! 💪✨",
//       image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
//       likes: 128,
//       comments: 15,
//       shares: 7
//     },
//     {
//       author: "Mike Johnson",
//       timestamp: "1 day ago",
//       title: "The Power of Tailwind CSS",
//       content: "Tailwind CSS has completely changed how I approach styling. The utility-first approach might seem odd at first, but once you get used to it, you'll never want to go back to traditional CSS. Highly recommend giving it a try!",
//       likes: 89,
//       comments: 12,
//       shares: 5
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Testing Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gradient mb-2">
//             Component Testing Display
//           </h1>
//           <p className="text-gray-600">
//             Testing PostBox and UserStatsBox Components
//           </p>
//         </div>

//         {/* Main Grid Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Sidebar - UserStatsBox */}
//           <div className="lg:col-span-1">
//             <UserStatsBox 
//               userName="Alex Morgan"
//               userBio="Software Developer | Tech Enthusiast | Coffee Lover ☕"
//               stats={sampleUserStats}
//             />
//           </div>

//           {/* Center Column - Posts Feed */}
//           <div className="lg:col-span-2">
//             <div className="mb-4">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Posts Feed</h2>
//             </div>
            
//             {/* Render all sample posts */}
//             {samplePosts.map((post, index) => (
//               <PostBox key={index} post={post} />
//             ))}
//           </div>
//         </div>

//         {/* Testing Info Footer */}
//         <div className="mt-8 p-6 glass-effect rounded-xl text-center">
//           <p className="text-sm text-gray-600">
//             💡 <strong>Note:</strong> This is a testing display. To restore the original app, 
//             uncomment the original code in App.jsx and comment out this testing code.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
