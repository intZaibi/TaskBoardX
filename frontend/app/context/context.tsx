'use client';

import { createContext, useEffect, useState } from 'react';

export const Context = createContext<{
  tasks: Task[];
  // setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}>({
  tasks: [],
  // setTasks: () => [],
});

export const ContextProvider = ({ children }: { children : React.ReactNode }) => {
  const [tasks, setTasks] = useState([]);

  // useEffect(() => {

  //   // Cleanup listeners on unmount
  //   return () => {
  //   };
  // }, []);

  return (
    <Context.Provider
      value={{
        tasks,
        // setTasks
      }}
    >
      {children}
    </Context.Provider>
  );
};