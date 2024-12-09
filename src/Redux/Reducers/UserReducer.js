import { createSlice, } from "@reduxjs/toolkit";
import { FetchUsers } from "../Actions/UsersAction";







const UsersSlice = createSlice({
    name: 'students',
    initialState: {
        users: [],
        status: 'idle',
        error: null,
        // currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        searchQuery: '',
    },
    reducers: {
       

    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(FetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { results, count, next, previous } = action.payload; // use the correct response structure
                
                state.users = results;
                state.totalCount = count
                // Adjust pagination handling as per the response
                state.totalPages = next ;
                state.error = null
            })
            .addCase(FetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })


    }
});

export default UsersSlice.reducer   