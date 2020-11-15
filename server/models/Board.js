module.exports.Account = require('./Account.js');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let BoardModel = {};

// mongoose.Types.ObjectID is a function that converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  board: {
    type: Array,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },

  size: {
    type: Number,
    min: 0,
    required: true,
  },
});

BoardSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  board: doc.board,
});

BoardSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return BoardModel.find(search).select('name board').lean().exec(callback);
};

BoardModel = mongoose.model('ColorBoard', BoardSchema);

module.exports = {
  BoardModel,
  BoardSchema,
};
