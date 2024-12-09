import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import JobList from "./JobList";
import JobFilters from "./JobFilter";

function JobSearch() {
    const { category } = useParams();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        type: 'all',
        location: 'all',
        expLevel: 'all'
    });

    useEffect(() => {
        const initialFetch = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8000/api/jobs');
                const data = await response.json();
                setJobs(data.jobs);
                setFilteredJobs(data.jobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
            setLoading(false);
        };
    
        initialFetch();
    }, []);
    

    // Fetch jobs from API
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8000/api/jobs?search=${searchQuery}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setJobs(data.jobs);
            applyFilters(data.jobs);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            // Show error message to user
            setJobs([]);
            setFilteredJobs([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter jobs based on selected filters
    const applyFilters = (jobsToFilter) => {
        let result = [...jobsToFilter];

        if (filters.type !== 'all') {
            result = result.filter(job => job.type === filters.type);
        }

        if (filters.location !== 'all') {
            result = result.filter(job => job.location === filters.location);
        }

        if (filters.expLevel !== 'all') {
            result = result.filter(job => job.expLevel === filters.expLevel);
        }

        setFilteredJobs(result);
    };

    // Handle search submit
    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    // Apply filters whenever filters change
    useEffect(() => {
        applyFilters(jobs);
    }, [filters]);

    // Initial fetch
    useEffect(() => {
        fetchJobs();
    }, [category]);

    useEffect(() => {
        console.log("filtered Jobs:", filteredJobs);
    }, [filteredJobs]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Search Bar */}
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for jobs..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>

            <JobFilters filters={filters} setFilters={setFilters} />
            <JobList jobs={filteredJobs} loading={loading} />
        </div>
    );
}

export default JobSearch;
