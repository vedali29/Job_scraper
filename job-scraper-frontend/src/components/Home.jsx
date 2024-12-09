import { FaBriefcase } from "react-icons/fa";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <FaBriefcase className="mx-auto text-6xl text-blue-600 mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Find Your Dream Job</h1>
            <p className="text-xl text-gray-600 mb-8">Explore opportunities across different job types and modes</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link to="/jobs/tech" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">Tech Jobs</h3>
                <p className="text-gray-600">Software, Data, DevOps positions</p>
              </Link>
              <Link to="/jobs/remote" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">Remote Jobs</h3>
                <p className="text-gray-600">Work from anywhere opportunities</p>
              </Link>
              <Link to="/jobs/hybrid" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">Hybrid Jobs</h3>
                <p className="text-gray-600">Flexible work arrangements</p>
              </Link>
            </div>
          </div>
        </div>
      </div> 
    )
}

export default Home;