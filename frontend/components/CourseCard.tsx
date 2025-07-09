interface Course {
  id: number;
  title: string;
  ownerId: number;
  status: string;
  progress: number;
}

export default function CourseCard({ 
  id = 1,
  title = "Introduction to Programming",
  progress = 30,
  ownerId = 1,
}) {

  return (
    <div className="flex flex-col gap-3 pb-3 bg-slate-200 rounded-lg">
      {/* <div
        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-t-lg"
        style={{backgroundImage: `url("${imageUrl}")`}}
      ></div> */}
      <div className="p-3">
        <p className="text-[#0d141c] text-base font-medium leading-normal">
          ID: 
          <span className="font-normal ml-2">
            {id}
          </span>
        </p>
        <p className="text-[#0d141c] text-base font-medium leading-normal">
          Title: 
          <span className="font-normal ml-2">
            {title}
          </span>
        </p>
        <p className="text-[#0d141c] text-base font-medium leading-normal">
          Ownder ID: 
          <span className="font-normal ml-2">
            {ownerId}
          </span>
        </p>
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex gap-6 justify-between">
            <p className="text-[#0d141c] text-base font-medium leading-normal">
              Progress
            </p>
            <p className="text-[#0d141c] text-sm font-normal leading-normal">{progress}%</p>
          </div>
          <div className="rounded bg-[#cedae8]">
            <div className="h-2 rounded bg-[#0c77f2]" style={{width: `${progress}%`}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
