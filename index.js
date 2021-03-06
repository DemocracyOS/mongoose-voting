/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.ObjectId;
/**
 * Expose mongoose voting
 */

module.exports = exports = voting;

/**
 * Mongoose Voting Plugin
 *
 * @param {Schema} schema MongooseSchema
 * @param {Object} options for plugin configuration
 * @api public
 */

function voting (schema, options) {
  options || ( options = {} );

  var voterModelName = options.ref || 'User';

  schema.add({
    vote: {
      positive: [{ type: ObjectId, ref: voterModelName }],
      negative: [{ type: ObjectId, ref: voterModelName }],
      census: [{ type: ObjectId, ref: voterModelName }]
    }
  });

  schema.methods.upvote = function upvote(user, fn) {
    // Reset vote if existed
    this.vote.negative.pull(user);

    // Upvote
    this.vote.positive.addToSet(user);
    this.vote.census.addToSet(user);

    // If callback fn, save and return
    if (2 === arguments.length) {
      this.save(fn);
    };
  };

  schema.methods.downvote = function downvote(user, fn) {
    // Reset vote if existed
    this.vote.positive.pull(user);

    // Downvote
    this.vote.negative.addToSet(user);
    this.vote.census.addToSet(user);

    // If callback fn, save and return
    if (2 === arguments.length) {
      this.save(fn);
    };
  };

  schema.methods.upvoted = function upvoted(user) {
    if (user._id) {
      return schema.methods.upvoted.call(this, user._id);
    };

    return !!~this.vote.positive.indexOf(user);
  };

  schema.methods.downvoted = function downvoted(user) {
    if (user._id) {
      return schema.methods.downvoted.call(this, user._id);
    };

    return !!~this.vote.negative.indexOf(user);
  };

  schema.methods.voted = function voted(user) {
    if (user._id) {
      return schema.methods.voted.call(this, user._id);
    };

    return !!~this.vote.census.indexOf(user);
  }
}