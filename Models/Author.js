import mongoose from "mongoose";

const Author = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        unique: true, 
        required: true 
    },
    biography: { 
        type: String 
    },
    profileImageUrl: { 
        type: String 
    },
    birthDate: { 
        type: Date 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
})

export default mongoose.model("Author", Author);
