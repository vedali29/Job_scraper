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
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        type: 'all',
        location: 'all',
        expLevel: 'all'
    });

    const initialFetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://job-scraper-n48t.onrender.com/scrape-jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    keywords: ['developer'],
                    max_jobs_per_keyword: 10
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setJobs(data.jobs);
            setFilteredJobs(data.jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError('Failed to load initial jobs. Please try again later.');
        }
        setLoading(false);
    };

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://job-scraper-n48t.onrender.com/scrape-jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    keywords: [searchQuery || 'developer'],
                    max_jobs_per_keyword: 10
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setJobs(data.jobs);
            applyFilters(data.jobs);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            setError('Failed to fetch jobs. Please try again.');
            setJobs([]);
            setFilteredJobs([]);
        } finally {
            setLoading(false);
        }
    };

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

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    useEffect(() => {
        initialFetch();
    }, []);

    useEffect(() => {
        applyFilters(jobs);
    }, [filters]);

    useEffect(() => {
        if (category) {
            fetchJobs();
        }
    }, [category]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
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
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>

            <JobFilters filters={filters} setFilters={setFilters} />
            <JobList jobs={filteredJobs} loading={loading} />
        </div>
    );
}

export default JobSearch;
