import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import JobSearch from './components/JobSearch';
import Blog from './components/Blog';
import { FaBriefcase } from 'react-icons/fa';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <Link to="/" className="flex items-center">
                <FaBriefcase className="text-blue-600 text-2xl" />
                <span className="ml-2 text-xl font-semibold">Job-Scraper</span>
              </Link>
              <div className="flex space-x-4 items-center">
                <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
                <Link to="/jobs/tech" className="text-gray-600 hover:text-blue-600">Jobs</Link>
                <Link to="/blog" className="text-gray-600 hover:text-blue-600">Blog</Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs/:category" element={<JobSearch />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
