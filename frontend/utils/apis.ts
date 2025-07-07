
export async function fetchCourses() {
  try {
    const res = await fetch('http://localhost:4000/courses', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MTkwMzkxMywiZXhwIjoxNzUxOTA3NTEzfQ.6CbhoMBF9ty5s1cnWbDKX9mu0CJhwd5b4RNa_GWddvE'
      },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to load courses');
    return res.json();
    
  } catch (error) {
    console.log(error)
  }
}

export async function fetchProjects() {
  try {
    const res = await fetch('http://localhost:4000/projects', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MTkwMzkxMywiZXhwIjoxNzUxOTA3NTEzfQ.6CbhoMBF9ty5s1cnWbDKX9mu0CJhwd5b4RNa_GWddvE'
      },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to load courses');
    return res.json();
    
  } catch (error) {
    console.log(error)
  }
}
