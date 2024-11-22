import { getMyJob } from "@/api/apiJobs"
import useFetch from "@/hooks/useFetch"
import { useUser } from "@clerk/clerk-react"
import { useEffect } from "react"
import JobCard from "./JobCard"
import { BarLoader } from "react-spinners"

const CreatedJobs = () => {
  const { user } = useUser()

  const {
    fn: fnCreatedJobs,
    data: createdJobs,
    loading: loadingCreatedJobs
  } = useFetch(getMyJob, {
    recruiter_id: user.id
  })

  useEffect(() => {
    fnCreatedJobs()
  }, [])

  if (loadingCreatedJobs) return <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>

  return (
    <div>
      <div className='my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {createdJobs?.length ? (
            createdJobs.map((job) => {
              return <JobCard key={job.id} job={job} onJobSaved={fnCreatedJobs} isMyJob />
            })
          ) : (
            <div>No Jobs Found</div>
          )}
        </div>
    </div>
  )
}

export default CreatedJobs
