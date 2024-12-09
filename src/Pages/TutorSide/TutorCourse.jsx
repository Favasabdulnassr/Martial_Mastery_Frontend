import TutorSidebar from "@/Components/TutorSidebar";
import TutorTopbar from "@/Components/TutorTopbar";
import React from "react";


function TutorCourse() {


  return (
        <div className="flex min-h-screen bg-gray-900 text-gray-100">
            <TutorSidebar/>

            <div className="flex-1 lg:ml-80">
             <TutorTopbar/> 




             <h4>Courses</h4>  
            </div>



        </div>

  )
}

export default TutorCourse