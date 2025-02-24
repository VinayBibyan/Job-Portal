function JobListing({ jobs, page, totalPages, setPage, navigate }) {
    return (
      <>
        {/* Job Listings */}
        <section className="flex-grow overflow-hidden p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-5 rounded-lg shadow-lg border-l-4 border-[#fb8500] text-left hover:shadow-xl transition min-h-[250px] self-start"
              >
                <h2 className="text-xl font-bold text-[#023047]">{job.title}</h2>
                <p className="text-[#219ebc] mt-1">{job.location}</p>
                <p className="mt-2 text-gray-700">{job.desc}</p>
                <button
                  onClick={() => navigate(`/job/${job._id}`)}
                  className="mt-4 bg-[#219ebc] text-white px-4 py-2 rounded hover:bg-[#fb8500] transition"
                >
                  Apply
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">No jobs found</p>
          )}
        </section>
  
        {/* Pagination */}
        <div className="py-4 flex justify-center shadow-md text-black">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className={`mx-2 px-4 py-2 rounded ${page === 1 ? "bg-gray-500 cursor-not-allowed" : "bg-[#ffb703] text-white hover:bg-[#fb8500]"}`}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="mx-2">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            className={`mx-2 px-4 py-2 rounded ${page === totalPages ? "bg-gray-500 cursor-not-allowed" : "bg-[#ffb703] text-white hover:bg-[#fb8500]"}`}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </>
    );
  }
  
  export default JobListing;