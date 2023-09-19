//utils.js --- function to return error message
export const getError= (error) =>{
    return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
}






// error.response.data.message  -- if we have given any error message to that specific error thn this refers to that message 