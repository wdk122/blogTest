// Post component - represents a single todo item
Post = React.createClass({
  propTypes: {
    post: React.PropTypes.object.isRequired,
    showPrivateButton: React.PropTypes.bool.isRequired
  },

  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call("setChecked", this.props.post._id, ! this.props.post.checked);
  },

  deleteThisPost() {
    Meteor.call("removePost", this.props.post._id);
  },

  togglePrivate() {
    Meteor.call("setPrivate", this.props.post._id, ! this.props.post.private);
  },

  render() {
    // Give posts a different className when they are checked off,
    // so that we can style them nicely in CSS
    // Add "checked" and/or "private" to the className when needed
    const postClassName = (this.props.post.checked ? "checked" : "") + " " +
      (this.props.post.private ? "private" : "");

    return (
      <li className={postClassName}>
        <button className="delete" onClick={this.deleteThisPost}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly={true}
          checked={this.props.post.checked}
          onClick={this.toggleChecked} />

        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate}>
            { this.props.post.private ? "Private" : "Public" }
          </button>
        ) : ''}

        <span className="text">
          <strong>{this.props.post.username}</strong>: {this.props.post.text}
        </span>
      </li>
    );
  }
});