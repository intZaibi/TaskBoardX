"use client";
import React, { useState } from "react";
import Form from "./Form";
import ProjectTable from "./ProjectTable";
import { Context } from "@/app/context/context";
import { toast, ToastContainer } from "react-toastify";
import NotificationSocket from "./Notifications";

export default function ProjectsComponent() {

  const [ids, setIds] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => {
    setIsOpen(false);
  };
  const {projects} = React.useContext(Context);

  const handleDialogOpen = () => {
    if (ids.length === 0) {
      toast.error("Please select at least one project to update.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    setIsOpen(true);
  }

  return (
    <div className="w-full bg-slate-50 my-5">
      <ToastContainer/>
      <NotificationSocket />
      <ProjectTable setIds={setIds} projects={projects} />
      <button onClick={handleDialogOpen} className="cursor-pointer mt-4 ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
        Update
      </button>
      <Form isOpen={isOpen} closeDialog={closeDialog} ids={ids} />
    </div>
  )
}