const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title:{
    type: String,
    required: true  
    },
    author:{
    type: String,
    required:true
    },
    description:{
        type: String,
        required: true 
        },
     coverImage:{
            type: String,
            required: true 
            },
            language:{
                type: String,
                required: true 
            },
            pages:{
                type: String,
                required: true 
            },
             genre:{
                type: String,
                required: true 
            },
            price:{
                type: Number,
                required: true 
                },
                
    
});

module.exports = mongoose.model("Book",bookSchema);