const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true },
  family_name: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  date_of_death: { type: Date },
});

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth ? formatDate(this.date_of_birth) : "";
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return this.date_of_death ? formatDate(this.date_of_death) : "";
});

AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});


module.exports = mongoose.model('Author', AuthorSchema);
