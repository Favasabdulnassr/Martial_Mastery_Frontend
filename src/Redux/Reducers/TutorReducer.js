import { createSlice, } from "@reduxjs/toolkit";
import { Fetchtutors } from "../Actions/TutorAction";






const TutorSlice = createSlice({
    name: 'tutors',
    initialState: {
        tutors: [],
        status: 'idle',
        error: null,
        // currentPage: 1,
        next:null,
        previous:null,
        searchQuery: '',
    },
    reducers: {
       

    },
    extraReducers: (builder) => {
        builder
            .addCase(Fetchtutors.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(Fetchtutors.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { results, count, next, previous } = action.payload; // use the correct response structure
                
                state.tutors = results;
                state.totalCount = count;
                // Adjust pagination handling as per the response
                state.next = next ;
                state.previous = previous
                state.error = null
            })
            .addCase(Fetchtutors.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })


    }
});

export default TutorSlice.reducer   