"use client";

import { fetchCourses, fetchProjects } from "@/utils/apis";
import { CourseTypes, ProjectTypes } from "@/utils/types";
import { createContext, useEffect, useState } from "react";

export const Context = createContext<{
  courses: CourseTypes[] | [];
  projects: ProjectTypes[] | [];
  setCourses: React.Dispatch<React.SetStateAction<CourseTypes[]>>;
  setProjects: React.Dispatch<React.SetStateAction<ProjectTypes[]>>;
}>({
  courses: [],
  projects: [],
  setCourses: () => [],
  setProjects: () => [],
});

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [courses, setCourses] = useState<CourseTypes[]>([]);
  const [projects, setProjects] = useState<ProjectTypes[]>([]);

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
      }}
    >
      {children}
    </Context.Provider>
  );
};