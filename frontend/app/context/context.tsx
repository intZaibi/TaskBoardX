"use client";

import { fetchCourses, fetchProjects } from "@/utils/apis";
import { CourseTypes, ProjectTypes, UserTypes } from "@/utils/types";
import { createContext, useEffect, useState } from "react";

export const Context = createContext<{
  courses: CourseTypes[] | [];
  projects: ProjectTypes[] | [];
  setCourses: React.Dispatch<React.SetStateAction<CourseTypes[]>>;
  setProjects: React.Dispatch<React.SetStateAction<ProjectTypes[]>>;
  user: UserTypes | null;
  setUser: React.Dispatch<React.SetStateAction<UserTypes | null>>;
}>({
  courses: [],
  projects: [],
  setCourses: () => [],
  setProjects: () => [],
  user: null,
  setUser: () => null,
});

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [courses, setCourses] = useState<CourseTypes[]>([]);
  const [projects, setProjects] = useState<ProjectTypes[]>([]);
  const [user, setUser] = useState<UserTypes | null>(null);

  const setCoursesData = async ()=>{
    const res = await fetchCourses();
    setCourses(res)
  }
  const setProjectsData = async ()=>{
    const res = await fetchProjects();
    setProjects(res)
  }

  useEffect(() => {
    setCoursesData();
    setProjectsData();
  }, []);

  return (
    <Context.Provider
      value={{
        courses,
        projects,
        setCourses,
        setProjects,
        user,
        setUser
      }}
    >
      {children}
    </Context.Provider>
  );
};