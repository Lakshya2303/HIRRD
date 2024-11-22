import { getApplications } from "@/api/apiApplications"
import useFetch from "@/hooks/useFetch"
import { useUser } from "@clerk/clerk-react"
import { BarLoader } from "react-spinners"
import ApplicationCard from "./ApplicationCard"
import { useEffect } from "react"

const CreatedApplications = () => { 
  const { user } = useUser()
  
  const {
    fn: fnApplications,
    data: applications,
    loading: loadingApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  })

  useEffect(() => {
    fnApplications()
  }, [])

  if (loadingApplications) return <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>

  return (
    <div className="flex flex-col gap-2">
      {applications?.map((app) => {
            return <ApplicationCard key={app.id} application={app} isCandidate={true} />
          })}
    </div>
  )
}

export default CreatedApplications
