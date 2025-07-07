"use client";

import { useContext, useEffect, useRef, useState } from "react";
// import { Context } from "@/app/context/Context";
// import { Task } from "@/types/types";
// import { socket } from "@/components/hooks/socket";

// type InputDialogPropsType = {
//   isOpen: boolean;
//   closeDialog: () => void;
//   isEditting?: { bool: boolean; task?: Task };
// };

// export default function InputDialog({ isOpen, closeDialog, isEditting = { bool:false } }: InputDialogPropsType) {
//   const { tasks, setTasks } = useContext(Context);

//   const [inputText, setInputText] = useState(isEditting.bool? isEditting.task?.text : '');
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (!isOpen) return;

//       if (e.key === 'Enter') {
//         e.preventDefault();
//         handleAddTask();
//       } else if (e.key === 'Escape') {
//         e.preventDefault();
//         closeDialog();
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [isOpen, inputText]);

//   function handleAddTask() {
//     const trimmedText = inputText?.trim();
//     if (!trimmedText) return;

//     const newTask: Task = {
//       id: String(tasks.length + 1),
//       text: trimmedText,
//       status: 'TODO',
//     };

//     const updatedTasks = [...tasks, newTask];
//     setTasks(updatedTasks);
//     socket.emit('updateTasks', updatedTasks);

//     setInputText('');
//     closeDialog();
//   };

//   function handleEditTask(task:Task|undefined) {
//     if (isEditting.bool && task) {
//       const trimmedText = inputText?.trim();
//       if (!trimmedText) return;

//       const edittedTask: Task = {
//         ...task,
//         text: trimmedText
//       };

//       const updatedTasks = [...tasks.filter((task)=>task.id!==edittedTask.id), edittedTask];
//       setTasks(updatedTasks);
//       socket.emit('updateTasks', updatedTasks);

//       setInputText('');
//       closeDialog();
//     }
//   }

//   return isOpen ? (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div className="fixed inset-0 bg-black/60" onClick={closeDialog} />

//       {/* Dialog Content */}
//       <div className="relative bg-black border border-gray-900 rounded-lg shadow-lg w-full max-w-md mx-4 p-6 animate-in fade-in-0 zoom-in-95 duration-200">
//         {/* Header */}
//         <div className="mb-4">
//           <h2 className="text-lg font-semibold leading-none tracking-tight mb-2 text-slate-50">
//             Add To-Do
//           </h2>
//           <p className="text-sm text-slate-400">
//             This will be added in the "To Do" section.
//           </p>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-between">
//           <button
//             type="button"
//             onClick={closeDialog}
//             className="rounded-md cursor-pointer bg-gray-800 text-white hover:bg-gray-700 h-10 px-4 py-2 text-sm"
//           >
//             Close
//           </button>
//           {isEditting.bool ?
//             <button
//               type="button"
//               onClick={()=>handleEditTask(isEditting.task)}
//               className="rounded-md cursor-pointer bg-gray-200 text-black hover:bg-gray-300 h-10 px-6 py-2 text-sm"
//             >
//               Save
//             </button>
//             :
//             <button
//               type="button"
//               onClick={handleAddTask}
//               className="rounded-md cursor-pointer bg-gray-200 text-black hover:bg-gray-300 h-10 px-6 py-2 text-sm"
//             >
//               Add
//             </button>
//           }
//         </div>

//         {/* Close (X) */}
//         <button
//           onClick={closeDialog}
//           className="absolute cursor-pointer right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950"
//         >
//           <svg
//             className="h-4 w-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//           <span className="sr-only">Close</span>
//         </button>
//       </div>
//     </div>
//   ) : null;
// }

type FormProps = {
  isOpen: boolean;
  closeDialog: () => void;
  ids: number[];
  initialStatus?: "in-progress" | "pending" | "done";
};

export default function Form({
  isOpen,
  closeDialog,
  ids,
  initialStatus = "pending",
}: FormProps) {
  const [status, setStatus] = useState<"in-progress" | "pending" | "done">(initialStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeDialog();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeDialog]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:4000/projects/bulk-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status }),
      });
      closeDialog();
    } catch (err) {
      // handle error as needed
    } finally {
      setLoading(false);
    }
  };
  console.log(isOpen)

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60" onClick={closeDialog} />

      {/* Dialog Content */}
      <div className="relative bg-black border border-gray-900 rounded-lg shadow-lg w-full max-w-md mx-4 p-6 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold leading-none tracking-tight mb-2 text-slate-50">
            Update Project Status
          </h2>
          <p className="text-sm text-slate-400">
            Update status for selected projects.
          </p>
        </div>

        {/* Input Field: IDs */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#101418] text-base font-medium leading-normal pb-2">
              Project IDs
            </p>
            <input
              disabled
              value={ids.join(", ")}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101418] border border-[#d4dbe2] bg-gray-100 h-14 p-[15px] text-base font-normal leading-normal"
            />
          </label>
        </div>

        {/* Input Field: Status */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#101418] text-base font-medium leading-normal pb-2">
              Status
            </p>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as "in-progress" | "pending" | "done")}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101418] focus:outline-0 focus:ring-0 border border-[#d4dbe2] bg-gray-50 focus:border-[#d4dbe2] h-14 placeholder:text-[#5c728a] p-[15px] text-base font-normal leading-normal"
            >
              <option value="in-progress">in-progress</option>
              <option value="pending">pending</option>
              <option value="done">done</option>
            </select>
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={closeDialog}
            className="rounded-md cursor-pointer bg-gray-800 text-white hover:bg-gray-700 h-10 px-4 py-2 text-sm"
            disabled={loading}
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="rounded-md cursor-pointer bg-gray-200 text-black hover:bg-gray-300 h-10 px-6 py-2 text-sm"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

        {/* Close (X) */}
        <button
          onClick={closeDialog}
          className="absolute cursor-pointer right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  ) : null;
}
