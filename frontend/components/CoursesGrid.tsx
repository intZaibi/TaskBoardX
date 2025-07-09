import { use } from "react";
import CourseCard from "./CourseCard";
interface Course {
  id: number;
  title: string;
  ownerId: number;
  status: string;
  progress: number;
}

interface CoursesGridProps {
  coursesPromise: Promise<Course[]>;
}

export default function CoursesGrid({ coursesPromise }: CoursesGridProps) {
  const courses = use<Course[]>(coursesPromise);
  
  return (
      <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4">
        {courses ? courses.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            progress={course.progress}
            id={course.id}
            ownerId={course.ownerId}
          />
        )):
        <h1 className="text-center text-xl text-black w-full">No Course Available!</h1>
        }
      </div>
  );
}
