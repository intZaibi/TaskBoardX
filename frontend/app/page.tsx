import CoursesGrid from "@/components/CoursesGrid";
import Sidebar from "@/components/Sidebar";
import { fetchCourses } from "@/utils/apis";
import { Suspense } from "react";

export default function Home() {
  const coursesPromise = fetchCourses();

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-slate-50">
      <Sidebar/>
      <div className="flex flex-col mt-8 px-3">
        <h1 className="text-2xl font-bold mb-4 text-[#0d141c]">Courses</h1>
          <Suspense fallback={<p className="text-center">Loading...</p>}>
            <CoursesGrid coursesPromise={coursesPromise}/>
          </Suspense>
      </div>
    </div>
  );
}
