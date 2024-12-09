import { FaBriefcase, FaMapMarkerAlt, FaClock, FaDollarSign } from 'react-icons/fa';

function JobList({ jobs, loading }) {
    console.log("Jobs in JobList:", jobs); // Add this debug log

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!jobs || jobs.length === 0) {
        return (
            <div className="text-center py-12">
                <FaBriefcase className="text-gray-400 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">No jobs found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
            </div>
        );
    }

    const getTypeStyle = (type) => {
        type = type?.toLowerCase();
        switch(type) {
            case 'full-time':
                return 'bg-green-100 text-green-800';
            case 'part-time':
                return 'bg-yellow-100 text-yellow-800';
            case 'contract':
                return 'bg-purple-100 text-purple-800';
            case 'intern':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <FaBriefcase className="text-blue-600 text-xl" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeStyle(job.type)}`}>
                                {job.type}
                            </span>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
                        <p className="text-gray-700 font-medium mb-4">{job.company}</p>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-600">
                                <FaMapMarkerAlt className="mr-2 text-gray-400" />
                                <span>{job.location}</span>
                            </div>
                            {job.salary && (
                                <div className="flex items-center text-gray-600">
                                    <FaDollarSign className="mr-2 text-gray-400" />
                                    <span>{job.salary}</span>
                                </div>
                            )}
                            <div className="flex items-center text-gray-600">
                                <FaClock className="mr-2 text-gray-400" />
                                <span>{job.expLevel}</span>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {job.description}
                        </p>

                        <div className="flex space-x-3">
                            <button className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                                Apply Now
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default JobList;
