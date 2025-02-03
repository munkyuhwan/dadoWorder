import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const setCommon = createAsyncThunk("common/setCommon", async(data,{dispatch,rejectWithValue}) =>{
    return data;
})

// Slice
export const commonSlice = createSlice({
    name: 'common',
    initialState: {
        tab:"menu",
    },
    extraReducers:(builder)=>{
        builder.addCase(setCommon.fulfilled,(state, action)=>{
            const payload = Object.assign({},state,action.payload);    
            return payload;
        })
        builder.addCase(setCommon.rejected,(state, action)=>{
            //state.adList=[]
        })
        builder.addCase(setCommon.pending,(state, action)=>{
            //state.adList=[]
        })


    }
});
