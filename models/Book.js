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
        
            },
             genre:{
                type: String,
            },
            price:{
                type: Number,
                required: true 
                },
                
    
});

module.exports = mongoose.model("Book",bookSchema);