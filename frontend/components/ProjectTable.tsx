import { ProjectTypes } from "@/utils/types";

const projects = [
  {
    "id": 1,
    "name": "Project Alpha",
    "status": "In Progress",
    "ownerId": 101,
    "progress": 45
  },
  {
    "id": 2,
    "name": "Project Beta",
    "status": "Done",
    "ownerId": 102,
    "progress": 100
  },
  {
    "id": 3,
    "name": "Project Gamma",
    "status": "Pending",
    "ownerId": 103,
    "progress": 0
  },
  {
    "id": 4,
    "name": "Project Delta",
    "status": "In Progress",
    "ownerId": 104,
    "progress": 60
  },
  {
    "id": 5,
    "name": "Project Epsilon",
    "status": "Done",
    "ownerId": 105,
    "progress": 100
  }
]

export default function ProjectTable({setIds, projects=[]}:{ setIds: React.Dispatch<React.SetStateAction<number[]>>; projects: ProjectTypes[]|[] }) {
  return (
    <div className="px-4 py-3 mt-10">
      <h1 className="text-2xl font-bold mb-4 text-[#0d141c]">Projects</h1>
      <div className="flex overflow-hidden rounded-lg border border-[#cedae8] bg-slate-50">
        <table className="flex-1">
          <thead>
            <tr className="bg-slate-50">
              <th className="hidden sm:table-cell px-4 py-3 text-left text-[#0d141c] w-[120px] text-sm font-medium leading-normal"></th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">
                ID
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">
                Project
              </th>
              <th className="px-4 py-3 text-left text-[#0d141c] w-60 text-sm font-medium leading-normal">
                Status
              </th>
              <th className="hidden lg:table-cell px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">
                Owner
              </th>
            </tr>
          </thead>
          <tbody>
            {projects && projects?.length > 0 ? projects?.map((project)=>(
              <tr key={project.id} className="border-t border-t-[#cedae8]">
                <td className="hidden sm:table-cell h-[72px] px-4 py-2 w-[120px] text-center text-sm font-normal leading-normal">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setIds((prev) => [...prev, project.id]);
                      } else {
                        setIds((prev) => prev.filter(id => id !== project.id));
                      }
                    }}
                    className="h-5 w-5 rounded border-[#cedae8] border-2 bg-transparent text-[#0c77f2] checked:bg-[#0c77f2] checked:border-[#0c77f2] focus:ring-0 focus:ring-offset-0 focus:border-[#cedae8] focus:outline-none"
                  />
                </td>
                <td className="hidden md:table-cell h-[72px] px-4 py-2 w-[400px] text-[#0d141c] text-sm font-normal leading-normal">
                  {project.id}
                </td>
                <td className="hidden md:table-cell h-[72px] px-4 py-2 w-[400px] text-[#0d141c] text-sm font-normal leading-normal">
                  {project.name}
                </td>
                <td className="hidden md:table-cell h-[72px] px-4 py-2 w-[400px] text-[#0d141c] text-sm font-normal leading-normal">
                  <span className={`px-3 py-1 rounded-lg ${project.status?.toLowerCase() === 'pending' ? 'bg-blue-200' : project.status.toLowerCase() === 'done' ? 'bg-green-200' : 'bg-amber-200'}`}> {project.status}</span>
                </td>
                <td className="hidden lg:table-cell h-[72px] px-4 py-2 w-[400px] text-[#0d141c] text-sm font-normal leading-normal">
                  {project.ownerId}
                </td>
              </tr>
            )):
              <tr>
                <td colSpan={5} className="h-[72px] px-4 py-2 text-center">
                  <h1 className="text-center text-lg text-black"> No Projects Available!</h1>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

