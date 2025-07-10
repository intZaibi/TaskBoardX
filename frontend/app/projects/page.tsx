import ProjectComponent from "@/components/ProjectsComponent";
import Sidebar from "@/components/Sidebar";

export default function page() {
  return (
    <div className="flex md:flex-row flex-col justify-center w-full bg-slate-50">
      <Sidebar/>
      <ProjectComponent/>
    </div>
  )
}