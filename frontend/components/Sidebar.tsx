import Link from "next/link";
const sidebarItems = [
  {
    id: 'courses',
    label: 'Courses',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    isActive: true,
    link: '/'
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M224,128a8,8,0,0,1-8,8H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128ZM128,72h88a8,8,0,0,0,0-16H128a8,8,0,0,0,0,16Zm88,112H128a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16ZM82.34,42.34,56,68.69,45.66,58.34A8,8,0,0,0,34.34,69.66l16,16a8,8,0,0,0,11.32,0l32-32A8,8,0,0,0,82.34,42.34Zm0,64L56,132.69,45.66,122.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Zm0,64L56,196.69,45.66,186.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z"></path>
      </svg>
    ),
    isActive: false,
    link: '/projects'
  },
];

export default function Sidebar() {

  return (
    <>
      <header className="sm:hidden flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaedf1] px-10 py-3">
        <div className="flex items-center gap-4 text-[#101418]">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-[#101418] text-lg font-bold leading-tight tracking-[-0.015em]">
            TaskMaster
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#eaedf1] text-[#101418] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
            <div
              className="text-[#101418]"
              data-icon="Bell"
              data-size="20px"
              data-weight="regular"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
              </svg>
            </div>
          </button>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDBEGEoe17Us8MZvlJIZ2RC-F0WbcYmlvajbrtEJOcAhO2moowDM93jrvgoC-K8BGVnz7fdqkxPHBj3tSWfQzdLs6iPmZ6OxD1k9g7NHw333G0QFkQQxXFed1PthFVevlrQV3V0LZ9-oMAzW8YcSHsNxzQmqeL8EX0eKWYqSzOVo2I3MRRiEuNklj_BtlUjaK_1JOk_z596BzwlfIiIzT1-tqwLKtqWTVlQQ33rpB6baU0Iao_Ox8vLis865NuNtanCkBmrNhnBXD0")'
            }}
          />
        </div>
      </header>
      <div className="hidden md:flex flex-col lg:w-80 mt-4 px-3">
        <div className="flex h-full min-h-[700px] flex-col justify-between bg-slate-50 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col text-center">
              <h1 className="text-[#0d141c] text-base font-semibold leading-normal">
                Course Admin
              </h1>
              <p className="text-[#49739c] text-sm font-normal leading-normal">
                Manage courses and projects
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {sidebarItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-10 py-2 rounded-lg cursor-pointer">
                  <div
                    className="text-[#0d141c]"
                  >
                    {item.icon}
                  </div>
                  <Link href={item.link} className="text-[#0d141c] text-sm font-medium leading-normal">
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
