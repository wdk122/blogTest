// Define a collection to hold our posts
Posts = new Mongo.Collection("posts");

if (Meteor.isClient) {
  // This code is executed on the client only
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Meteor.subscribe("posts");

  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    React.render(<App />, document.getElementById("render-target"));
  });
}

if (Meteor.isServer) {
  // Only publish posts that are public or belong to the current user
  Meteor.publish("posts", function () {
    return Posts.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}

Meteor.methods({
  addPost(text) {
    // Make sure the user is logged in before inserting a post
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Posts.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },

  removePost(postId) {
    const post = Posts.findOne(postId);
    if (post.private && post.owner !== Meteor.userId()) {
      // If the post is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Posts.remove(postId);
  },

  setChecked(postId, setChecked) {
    const post = Posts.findOne(postId);
    if (post.private && post.owner !== Meteor.userId()) {
      // If the post is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }

    Posts.update(postId, { $set: { checked: setChecked} });
  },

  setPrivate(postId, setToPrivate) {
    const post = Posts.findOne(postId);

    // Make sure only the post owner can make a post private
    if (post.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Posts.update(postId, { $set: { private: setToPrivate } });
  }
});