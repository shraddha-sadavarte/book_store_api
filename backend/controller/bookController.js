import Book from '../models/Book.js'

//public
export const getAllBooks = async (req, res, next) => {
    try{
        const books = await Book.find().populate('createdBy', 'name email')
        res.json(books)
    } catch(err){
        next(err);
    }
}

export const getBookById = async (req, res, next) => {
    try{
        const book = await Book.findById(req.params.id);
        if(!book) return res.status(404).json({message:'Book not found'})
            res.json(book);
    } catch(err){
        next(err);
    }
}

//admin routes
export const createBook = async (req, res, next) => {
    try{
        const book = await Book.create({ ...req.body, createdBy: req.user._id});
        res.status(201).json(book);        
    } catch(err){
        next(err);
    }
}

export const updateBook = async (req, res, next) =>{
    try{
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true})
        if(!book) return res.status(404).json({ message: 'Book not found'})
        res.json(book);
    } catch(err){
        next(err);
    }
}

export const deleteBook = async (req, res, next) => {
    try{
        const book = await Book.findByIdAndDelete(req.params.id);
        if(!book) return res.status(404).json({ message: 'Book not found'})
        res.json({ message: 'Book deleted successfully'})
    } catch(err){
        next(err);
    }
}