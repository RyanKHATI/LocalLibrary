const Book = require('../models/book');
const Author = require('../models/author');
const async = require('async');
const mongoose = require('mongoose');

exports.index = async function (req, res, next) {
  try {
    const bookCount = await Book.countDocuments({});
    const authorCount = await Author.countDocuments({});
    
    res.render('index', { title: 'Local Library Home', data: { book_count: bookCount, author_count: authorCount } });
  } catch (err) {
    next(err);
  }
};

exports.book_list = function(req, res, next) {
  Book.find({}, 'title author')
  .populate('author')
  .then((books) => {
    res.render('book_list', { title: 'All Books', book_list: books });
  })
  .catch((err) => {
    next(err);
})};

exports.book_create_get = function(req, res) {
  const newBook = {
    title: '',
    author: null,
    summary: '',
    isbn: '',
  };

  Author.find()
    .then(authors => {
      res.render('book_form', { title: 'Create Book', authors, book: newBook });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
};



      
exports.book_create_post = function(req, res, next) {
    const { title, isbn, summary, author } = req.body;
  
    const book = new Book({
      title,
      isbn,
      summary,
      author,
    });
  
    book.save()
      .then(() => res.redirect('/catalog/books'))
      .catch(err => next(err));
  };
  
exports.book_detail = function(req, res, next){
  const bookId = req.params.id;

  Book.findById(bookId)
      .populate('author')
      .then(book =>{
        res.render('book_detail', { title: 'Book Detail', book});
      })
      .catch(err => next(err));

}

exports.book_update_get = function(req, res, next) {
  const bookId = req.params.id;

  Book.findById(bookId)
    .populate('author')
    .then(book => {
        return Author.find({}, 'first_name family_name')
            .then(authors => {
                res.render('book_form', { title: 'Update Book', book, authors });
            });
    })
    .catch(err => {
        return next(err);
    });
};

exports.book_update_post = function (req, res, next) {
  const id = req.params.id;
  const book = req.body;

  console.log('Updating book with ID:', id);

  Book.findOneAndUpdate({ _id: id }, book, { new: true })
    .then((updatedBook) => {
      console.log('Updated book:', updatedBook);

      if (!updatedBook) {
        console.log('Book not found');
        return res.status(404).send('Book not found');
      }

      res.redirect(updatedBook.url);
    })
    .catch((err) => {
      console.error('Error updating book:', err);
      return next(err);
    });
};



exports.book_delete_get = async function(req, res, next) {
  try {
      const book = await Book.findById(req.params.id).populate('author');

      res.render('book_delete', { title: 'Delete Book', book });
  } catch (err) {
      next(err);
  }
};



exports.book_delete_post = function(req, res, next) {
  const bookId = req.params.id;

  Book.findByIdAndDelete(bookId)
      .then(deletedBook => {
          if (!deletedBook) {
              res.redirect('/catalog/books');
              return;
          }
          res.redirect('/catalog/books');
      })
      .catch(err => {
          next(err);
      });
};

