function JobFilters({ filters, setFilters }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-wrap gap-4">
                <select 
                    className="border p-2 rounded"
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                    <option value="all">All Types</option>
                    <option value="intern">Intern</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                </select>

                <select 
                    className="border p-2 rounded"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                >
                    <option value="all">All Locations</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                </select>

                <select 
                    className="border p-2 rounded"
                    value={filters.expLevel}
                    onChange={(e) => setFilters({...filters, expLevel: e.target.value})}
                >
                    <option value="all">Experience Level</option>
                    <option value="fresher">Fresher</option>
                    <option value="mid-level">Mid-level (+1 to 5 years)</option>
                    <option value="senior">Senior-level (+5 years)</option>
                </select>
            </div>
        </div>
    );
}

export default JobFilters;
