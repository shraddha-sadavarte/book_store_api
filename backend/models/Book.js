import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title:       { type: String, required: true, trim: true },
    author:      { type: String, required: true, trim: true },
    description: { type: String },
    price:       { type: Number, required: true },
    category:    { type: String, required: true },
    stock:       { type: Number, default: 0 },
    coverImage:  { type: String, default: '' },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);