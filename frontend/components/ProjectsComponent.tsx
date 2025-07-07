"use client";
import { useState } from "react";
import Form from "./Form";
import ProjectTable from "./ProjectTable";
import {fetchProjects} from '@/utils/apis';
export default function ProjectsComponent() {
  const projectsPromise = fetchProjects();
  const [ids, setIds] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full bg-slate-50 my-5">
      <ProjectTable projectsPromise={projectsPromise} setIds={setIds}  />
      <button onClick={()=>setIsOpen(!isOpen)} className="cursor-pointer mt-4 ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
        Update
      </button>
      <Form isOpen={isOpen} closeDialog={closeDialog} ids={[]} />
    </div>
  )
}