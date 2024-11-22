import supabaseClient from "@/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery }) { 
    const supabase =  supabaseClient(token);

    let query = supabase
        .from("jobs")
        .select("*, company : companies(name,logo_url), saved : saved_jobs(id)");

    if (location) {
        query = query.eq("location", location);
    }
    if (company_id) {
        query = query.eq("company_id", company_id);
    }
    if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
        console.error('Error fetching jobs:', error);
        return null;
    }

    return data
}

export async function saveJobs(token, { alreadySaved  }, savedData) { 
    const supabase =  supabaseClient(token);

    if (alreadySaved) {
        let query = await supabase
        .from("saved_jobs")
        .delete()
        .eq("job_id", savedData.job_id); 

        const { data, error: deleteError } = query;

        if (deleteError) {
            console.error('Error deleting saved jobs:', error);
            return null;
        }

        return data
    } else {
        let query = await supabase
        .from("saved_jobs")
        .insert(savedData)
        .select();  

        const { data, error: insertError } = query;

        if (insertError) {
            console.error('Error inserting saved jobs:', insertError.message);
            return null;
        }
        
        return data
    }
}

export async function getSingleJob(token, { job_id }) { 
    const supabase =  supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .select("*, company:companies(name,logo_url), applications:applications(*)")
        .eq("id", job_id)
        .single();

    if (error) {
        console.error('Error fetching Job:', error);
        return null;
    }
    
    return data;
}

export async function updateHiringStatus(token, { job_id }, isOpen) { 
    const supabase =  supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .update({ isOpen })
        .eq("id", job_id)
        .select();

    if (error) {
        console.error('Error Updating Jobs:', error);
        return null;
    }
    
    return data;
}

export async function addNewJob(token, _, jobData) { 
    const supabase =  supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .insert(jobData)
        .select();

    if (error) {
        console.error('Error Creating Job:', error);
        return null;
    }
    
    return data;
}

export async function getSavedJob(token) { 
    const supabase =  supabaseClient(token);

    const { data, error } = await supabase
        .from("saved_jobs")
        .select("*, job: jobs(*, company: companies(name,logo_url))");

    if (error) {
        console.error('Error Fetching Saved Job:', error);
        return null;
    }
    
    return data;
}

export async function getMyJob(token, {recruiter_id}) {   
    const supabase =  supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .select("*,  company: companies(name,logo_url)")
        .eq("recruiter_id", recruiter_id);

    if (error) {
        console.error('Error Fetching My Job:', error);
        return null;
    }
    
    return data;
}

export async function deleteJob(token, { job_id }) {   
    const supabase =  supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", job_id)
        .select();

    if (error) {
        console.error('Error Deleting Job:', error);
        return null;
    }
    
    return data;
}