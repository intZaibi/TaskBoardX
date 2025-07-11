export async function fetchCourses() {
  console.log(process.env.NEXT_PUBLIC_API_END_POINT_BASE_URL)
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT_BASE_URL}/courses`, {
      cache: 'no-store',
    });

    if (!res.ok && res.status !== 404) {
      const responseData = await res.json();
      console.log('status:' + responseData.status + ' error: ' + responseData.error);
      throw new Error('Failed to fetch courses');
    }
    return await res.json();
    
  } catch (error) {
    console.log(error)
    return [];
  }
}

export async function fetchProjects() {

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT_BASE_URL}/projects`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.log(res)
      const responseData = await res.json();
      console.log('status:' + responseData.status + ' error: ' + responseData.error);
      throw new Error(responseData.error || 'Failed to fetch projects');
    }

    return await res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const refreshToken = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT_BASE_URL}/auth/refresh`, {
      headers: {
        'Authorization': `Bearer ${getCookie('authToken')}`,  // Adjust to your current token retrieval method
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Token refreshing failed with status code: ${res.status}`);
    }
    return
  } catch (error) {
    console.log(error);
    return null;
  }
};

function getCookie(name:string) {
  const cookieArr = document.cookie.split(';');
  for (let i = 0; i < cookieArr.length; i++) {
    let cookie = cookieArr[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

export async function fetchProjectById(id: number) {
  let token = getCookie('authToken');

  if (!token) {
    console.log('No token found in cookies');
    return null;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT_BASE_URL}/projects/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to load project');
    }

    return await res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateProject(id: number, data: any) {
  let token = getCookie('authToken');

  if (!token) {
    console.log('No token found in cookies');
    return null;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to update project');
    }

    return await res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}


export async function sendNotification(userId: number, message: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_END_POINT_BASE_URL}/notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
    body: JSON.stringify({ userId, message }),
  });
}
