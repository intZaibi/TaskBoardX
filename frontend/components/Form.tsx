"use client";

import { Context } from "@/app/context/context";
import { refreshToken } from "@/utils/apis";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

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
  const [status, setStatus] = useState<"in-progress" | "pending" | "done">(
    initialStatus
  );
  const [loading, setLoading] = useState(false);
  const { projects, setProjects } = useContext(Context);
  const router = useRouter();

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
    const prevProjects = [...projects]; // Take a snapshot just before the update
    setLoading(true);
    setProjects((prev) =>
      prev.map((project) => {
        if (ids.includes(project.id)) {
          return { ...project, status };
        }
        return project;
      })
    );
    closeDialog();
    try {
      const res = await fetch("http://localhost:4000/projects/bulk-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids, status }),
      });

      if (!res.ok) {
        if (res.status === 401) router.push("/login"); // Redirect to login if unauthorized

        res.json().then((data) => {
          if (data.error.includes("expired")) {
            refreshToken().then(() => {
              handleUpdate(); // Retry the update after refreshing token
            });
            return;
          } else setProjects(prevProjects);

          toast.error("Error: " + data.error, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          throw new Error(data.error);
        });
      }

      if (res.ok) {
        const result = await res.json();
        if (result.skipped.length > 0) {
          const skippedIds = result.skipped
            .map((item: { id: number; reason: string }) => `#${item.id}`)
            .join(", ");
          console.log(result.skipped);
          toast.warn(
            `ID: ${skippedIds} skipped due to some reason! see console...`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
          setProjects((current) =>
            current.map((project) => {
              const wasSkipped = result.skipped.some(
                (item: { id: number }) => item.id === project.id
              );
              if (wasSkipped) {
                const original = prevProjects.find((p) => p.id === project.id);
                return original || project;
              }
              return project;
            })
          );
        }

        if (result.updated.length > 0) {
          const updatedIds = result.updated
            .map((item: { id: number }) => `#${item.id}`)
            .join(", ");
          toast.success(`ID: ${updatedIds} updated successfully!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    } catch (err) {
      console.error("Error updating project status:", err);
      // revert the status change in case of error
      setProjects(prevProjects);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {/* Dialog */}
      {isOpen ? (
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
                <p className="text-slate-50 text-base font-medium leading-normal pb-2">
                  Projects IDs
                </p>
                <input
                  disabled
                  value={ids.join(", ")}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101418] border border-[#d4dbe2] bg-slate-400 h-14 p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>

            {/* Input Field: Status */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-5">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-slate-50 text-base font-medium leading-normal pb-2">
                  Status
                </p>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as "in-progress" | "pending" | "done"
                    )
                  }
                  className="cursor-pointer flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101418] focus:outline-0 focus:ring-0 border border-[#d4dbe2] bg-gray-50 focus:border-[#d4dbe2] h-14 placeholder:text-[#5c728a] p-[15px] text-base font-normal leading-normal"
                >
                  <option className="cursor-pointer" value="in-progress">
                    in-progress
                  </option>
                  <option className="cursor-pointer" value="pending">
                    pending
                  </option>
                  <option className="cursor-pointer" value="done">
                    done
                  </option>
                </select>
              </label>
            </div>

            {/* Footer */}
            <div className="flex justify-between mt-2">
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
      ) : null}
    </>
  );
}
