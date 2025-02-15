import mongoose from "mongoose";

const Member = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        unique: true, 
        required: true 
    },
    email: { 
        type: String, 
        unique: true, 
        required: true 
    },
    birthDate: { 
        type: Date, 
        required: true 
    },
    subscribedBooks: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book' 
    }],
    borrowedBooks: [
      {
        borrowedBookId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Book' 
        },
        borrowedDate: { 
            type: Date, 
            default: Date.now 
        },
        returnDate: { 
            type: Date 
        },
      },
    ],
    returnRate: { 
        type: Number, 
        default: 100 
    }
})

export default mongoose.model("Member", Member);
