// App component - represents the whole app
App = React.createClass({

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      hideCompleted: false
    }
  },

  // Loads items from the Posts collection and puts them on this.data.posts
  getMeteorData() {
    let query = {};

    if (this.state.hideCompleted) {
      // If hide completed is checked, filter posts
      query = {checked: {$ne: true}};
    }

    return {
      posts: Posts.find(query, {sort: {createdAt: -1}}).fetch(),
      incompleteCount: Posts.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user()
    };
  },

  renderPosts() {
    // Get posts from this.data.posts
    return this.data.posts.map((post) => {
      const currentUserId = this.data.currentUser && this.data.currentUser._id;
      const showPrivateButton = post.owner === currentUserId;

      return <Post
        key={post._id}
        post={post}
        showPrivateButton={showPrivateButton} />;
    });
  },

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    var text = React.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call("addPost", text);

    // Clear form
    React.findDOMNode(this.refs.textInput).value = "";
  },

  toggleHideCompleted() {
    this.setState({
      hideCompleted: ! this.state.hideCompleted
    });
  },

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.data.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly={true}
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted} />
            Hide Completed Posts
          </label>

          <AccountsUIWrapper />

          { this.data.currentUser ?
            <form className="new-post" onSubmit={this.handleSubmit} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new posts" />
            </form> : ''
          }
        </header>

        <ul>
          {this.renderPosts()}
        </ul>
      </div>
    );
  }
});