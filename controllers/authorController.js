const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');

exports.author_list = async function (req, res, next) {
  try {
      const authors = await Author.find()
      res.render('author_list', { title: 'Author List', authors });
  } catch (err) {
      next(err);
  }
};

exports.author_create_get = function (req, res) {
  const newAuthor = {
    first_name: '',
    family_name: '',
    date_of_birth: null,
    date_of_death: null,
  };

  res.render('author_form', { title: 'Create Author', author: newAuthor });
};



exports.author_create_post = function (req, res, next) {
  const { first_name, family_name, date_of_birth, date_of_death } = req.body;

  const author = new Author({
      first_name,
      family_name,
      date_of_birth,
      date_of_death ,
  });

  author.save()
      .then(() => res.redirect('/catalog/authors'))
      .catch(err => next(err));
};

  exports.author_detail = async function (req, res, next) {
    try {
        const authorId = req.params.id;

        const author = await Author.findById(authorId);
        const books = await Book.find({ 'author': authorId });

        if (!author) {
            const err = new Error('Author not found');
            err.status = 404;
            throw err;
        }

        res.render('author_detail', { title: 'Author Detail', author, books });
    } catch (err) {
        next(err);
    }
    
};

exports.author_update_get = function (req, res, next) {
  const authorId = req.params.id;

  Author.findById(authorId)
      .then(author => {
          res.render('author_form', { title: 'Update Author', author });
      })
      .catch(err => {
          return next(err);
      });
};

exports.author_update_post = function (req, res, next) {
  const authorId = req.params.id;
  const updatedAuthor = req.body;

  console.log('Updating author with ID:', authorId);

  Author.findByIdAndUpdate(authorId, updatedAuthor, { new: true })
      .then((updatedAuthor) => {
          console.log('Updated author:', updatedAuthor);

          if (!updatedAuthor) {
              console.log('Author not found');
              return res.status(404).send('Author not found');
          }

          res.redirect(updatedAuthor.url);
      })
      .catch((err) => {
          console.error('Error updating author:', err);
          return next(err);
      });
};

exports.author_delete_get = async function (req, res, next) {
  try {
      const author = await Author.findById(req.params.id);

      res.render('author_delete', { title: 'Delete Author', author });
  } catch (err) {
      next(err);
  }
};

exports.author_delete_post = async function(req, res, next) {
  const authorId = req.params.id;

  try {
    const deletedAuthor = await Author.findByIdAndDelete(authorId);

    if (!deletedAuthor) {
      res.redirect('/catalog/authors');
      return;
    }

    await Book.updateMany({ author: authorId }, { $set: { author: null } });

    res.redirect('/catalog/authors');
  } catch (err) {
    next(err);
  }
};


