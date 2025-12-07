import Navbar from "../components/common/Navbar";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Feed</h2>

        {/* Posts will come here */}
        <div className="text-gray-500">
          No posts yet! Start connecting with others 👀
        </div>
      </div>
    </div>
  );
}
