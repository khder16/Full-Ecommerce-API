const { string, boolean, array } = require('joi')
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    numViews: {
        type: Number,
        default: 0
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type: Boolean,
        defraul: false
    },
    likes: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User2"
    }],
    dislikes: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User2"
    }],
    image:[],
    author: {
        type: String,
        default:"Admin"
    }}, {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
        
    }
    
)

module.exports = mongoose.model("Blog", blogSchema)