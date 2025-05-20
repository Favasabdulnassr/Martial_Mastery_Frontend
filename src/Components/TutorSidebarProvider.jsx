import React, {createContext,useContext,useState} from 'react';

const TutorSidebarContext = createContext();

export const TutorSidebarProvider = ({children}) =>{
    const[isSidebarTutorOpen,setSidebarTutorOpen] = useState(false);

    return(
        <TutorSidebarContext.Provider value={{isSidebarTutorOpen,setSidebarTutorOpen}}>
            {children}

        </TutorSidebarContext.Provider>
    );

};

export const useTutorSidebar = () => useContext(TutorSidebarContext)