import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import useFetch from '@/hooks/useFetch';
import { deleteJob, saveJobs } from '@/api/apiJobs';
import { useEffect, useState } from 'react';

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
}) => {
  const [ saved, setSaved ] = useState(savedInit)

  const { user } = useUser();

  const { 
    fn:fnSavedJobs,
    data: savedJobs, 
    loading: loadingSavedJobs
  } = useFetch(saveJobs, {
    alreadySaved: saved,
  });

  const handleSave = async () => {
    await fnSavedJobs({
      user_id: user.id,
      job_id: job.id,
    })
    onJobSaved()
  }

  const {
    fn:fnDeleteJob,
    loading:loadingDeleteJob
  } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const handleDelete = async () => {
    await fnDeleteJob()
    onJobSaved()
  }

  useEffect(() => {
    if (savedJobs!==undefined) {
      setSaved(savedJobs?.length > 0);
    }
  }, [savedJobs])

  return (
    <Card className='flex flex-col'>
      {loadingDeleteJob && <BarLoader className='mt-4' width={"100%"} color='#36d7b7'/>}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {isMyJob && (
            <Trash2Icon
              fill='red'
              size={18}
              onClick={handleDelete}
              className='text-red-300 cursor-pointer' 
            />
          )} 
        </CardTitle>
      </CardHeader>

      <CardContent className='flex flex-col gap-4 flex-1'>
        <div className="flex justify-between">
          {job.company && <img src={job.company.logo_url} alt={job.company.name} className='h-5'/>}
          <div className='flex gap-2 items-center'>
            <MapPinIcon size={15} />{job.location}
          </div>
        </div>
        <hr />
        {job.description.substring(0, job.description.indexOf('.') + 1)}
      </CardContent>
      <CardFooter className='flex gap-2'>
        <Link to={`/job/${job.id}`} className='flex-1'>
          <Button variant="secondary" className='w-full'>
            More Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button 
            variant="outline" 
            className='w-15' 
            onClick={handleSave}
            disabled={loadingSavedJobs}
          >
            {saved ? (
              <Heart size={20} stroke='red' fill='red'/>
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default JobCard
