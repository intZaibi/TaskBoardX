import CoursesGrid from "@/components/CoursesGrid";
import NotificationSocket from "@/components/Notifications";
import Sidebar from "@/components/Sidebar";
import { fetchCourses } from "@/utils/apis";
import { Suspense } from "react";

export default function Home() {
  const coursesPromise = fetchCourses();

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-slate-50">
      <Sidebar/>
      <NotificationSocket />
      <div className="flex flex-col mt-8 px-3">
      <div className="mb-5 text-center">
        <h1 className="text-3xl font-bold text-[#0d141c]">Welcome to Devzz</h1>
        <p className="mt-2 text-gray-600">Your one-stop solution for learning and managing projects.</p>
        <p className="mt-2 text-gray-600">Explore our courses and projects to enhance your skills.</p>
      </div>
        <h1 className="text-2xl font-bold mb-4 text-[#0d141c]">Courses</h1>
          <Suspense fallback={<p className="text-center">Loading...</p>}>
            <CoursesGrid coursesPromise={coursesPromise}/>
          </Suspense>
      </div>
    </div>
  );
}
