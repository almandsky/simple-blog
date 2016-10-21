import React from "react"
import { observer } from "mobx-react"


@observer
export default class BlogList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editmode: 'create',
      currentBlog: null
    };
  }

  componentDidMount() {
    // init
    this.showButtonEl = document.querySelector('.js-menu-show');
    this.hideButtonEl = document.querySelector('.js-menu-hide');
    this.sideNavEl = document.querySelector('.js-modalviewer');
    this.sideNavContainerEl = document.querySelector('.js-modalviewer-container');
    this.showModalViewer = this.showModalViewer.bind(this);
    this.hideModalViewer = this.hideModalViewer.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.update = this.update.bind(this);

    this.startX = 0;
    this.currentX = 0;
    this.touchingModalViewer = false;

    this.supportsPassive = undefined;
    this.addEventListeners();

    // get the blogs
    // TODO: implement the server side rendering to have better performance
    this.props.store.getBlogs();
  }

  getBlogs(e) {
    if (e.which === 13) {
      this.props.store.getBlogs(e.target.value);
    }
  }

  handleClick() {
    const self = this;
    const inputTitle = this.refs.inputtitle.value;
    const inputText = this.refs.inputtext.value;
    console.log('I am clicked! title is ' + inputTitle);
    console.log('text is ' + inputText);
    console.log('editmode is ' + self.state.editmode);
    
    if (!inputTitle || !inputText) {
      //TODO: will add more error handling for the input error and show it here
      console.log('invalid input');
    } else {
      if (this.state.editmode === 'create') {
        this.props.store.createBlog(inputTitle, inputText);
      } else {
        this.props.store.updateBlog(this.state.currentBlog, inputTitle, inputText);
      }
      
      this.refs.inputtitle.value = '';
      this.refs.inputtext.value = '';
      this.hideModalViewer();
    }
  }

  createPost() {
    this.refs.inputtitle.value = '';
    this.refs.inputtext.value = '';
    this.setState({editmode: 'create'});
    this.showModalViewer();
  }

  editPost(blog) {
    console.log('editing blog ' + blog.title);
    this.refs.inputtitle.value = blog.title;
    this.refs.inputtext.value = blog.text;
    this.setState({
      editmode: 'update',
      currentBlog: blog
    });
    this.showModalViewer();
  }

  deletePost(blog) {
    console.log('deleting blog ' + blog.title);
    let r = confirm("Do you really want to delete the post?");
    if (r == true) {
        // remove the blog post
        this.props.store.deleteBlog(blog);
    }
  }
  

  // the following methods are for the animation of the modal.
  // TODO: seperate the component into different file to have bette code structure
  applyPassive () {
    if (this.supportsPassive !== undefined) {
      return this.supportsPassive ? {passive: true} : false;
    }

    let isSupported = false;
    try {
      document.addEventListener('test', null, {get passive () {
        isSupported = true;
      }});
    } catch (e) { }
    this.supportsPassive = isSupported;
    return this.applyPassive();
  }

  addEventListeners () {
    this.hideButtonEl.addEventListener('click', this.hideModalViewer);

    this.sideNavEl.addEventListener('touchstart', this.onTouchStart, this.applyPassive());
    this.sideNavEl.addEventListener('touchmove', this.onTouchMove, this.applyPassive());
    this.sideNavEl.addEventListener('touchend', this.onTouchEnd);
  }

  onTouchStart (evt) {
    if (!this.sideNavEl.classList.contains('modalviewer--visible'))
      return;

    this.startX = evt.touches[0].pageX;
    this.currentX = this.startX;

    this.touchingModalViewer = true;
    requestAnimationFrame(this.update);
  }

  onTouchMove (evt) {
    if (!this.touchingModalViewer)
      return;

    this.currentX = evt.touches[0].pageX;
  }

  onTouchEnd (evt) {
    if (!this.touchingModalViewer)
      return;

    this.touchingModalViewer = false;

    const translateX = Math.min(0, this.currentX - this.startX);
    this.sideNavContainerEl.style.transform = '';

    if (translateX < 0) {
      this.hideModalViewer();
    }
  }

  update () {
    if (!this.touchingModalViewer)
      return;

    requestAnimationFrame(this.update);

    const translateX = Math.min(0, this.currentX - this.startX);
    this.sideNavContainerEl.style.transform = `translateX(${translateX}px)`;
  }
  onTransitionEnd (evt) {
    this.sideNavEl.classList.remove('modalviewer--animatable');
    this.sideNavEl.removeEventListener('transitionend', this.onTransitionEnd);
  }

  showModalViewer () {
    this.sideNavEl.classList.add('modalviewer--animatable');
    this.sideNavEl.classList.add('modalviewer--visible');
    this.sideNavEl.addEventListener('transitionend', this.onTransitionEnd);
  }

  hideModalViewer () {
    this.sideNavEl.classList.add('modalviewer--animatable');
    this.sideNavEl.classList.remove('modalviewer--visible');
    this.sideNavEl.addEventListener('transitionend', this.onTransitionEnd);
  }


  // The render function of the react component
  render() {
    const {blogs, error, errorMessage, getBlogs, createBlog, deleteBlog} = this.props.store

    // Render the blog list of the right rail
    // TODO: Move the right rail in a separate file of component
    const blogList = blogs.map(blog => (
      <tr key={blog.id}>
        <td>{blog.title}</td>
      </tr>
    ))

    // Render the blog post body of the content column
    // TODO: Move the content rendering in a separate file of component
    const blogDetailList = blogs.map(blog => (
      <div key={blog.id} className="blog-list-content">
        <div>
        <h2>{blog.title}</h2>
        <p>{blog.text}</p>
        </div>
        <div>
          <button type="button" className="btn btn-info btn-sm" onClick={this.editPost.bind(this, blog)}>Edit</button>
          <button type="button" className="btn btn-danger btn-sm" onClick={this.deletePost.bind(this, blog)}>Delete</button>
        </div>
        <hr/>
      </div>
    ))
    return <div className="container">
      <div className="row">
        <div className="col-sm-9">
          <h1>My Blog</h1>
        </div>
        <div className="col-sm-3">
          <button type="button" className="js-menu-show btn btn-info btn-md" onClick={this.createPost.bind(this)}>Create Post</button>
        </div>
      </div>

      <div className="js-modalviewer modalviewer">
        <div className="js-modalviewer-container modalviewer__container">
          <button className="js-menu-hide modalviewer__hide material-icons">close</button>
          <div className="modalviewer__header">
            {this.state.editmode === 'create'? 'Create New Blog' : 'Update Blog'}
          </div>
          <div style={{marginBottom: "10px"}}>
            <input className="form-control"
              ref="inputtitle"
              placeholder="Title"
              required
            />
          </div>
          <div>
            <textarea className="form-control"
              ref="inputtext"
              placeholder="Blog Text"
              rows="10"
              required
            />
          </div>
          <div >
            <button type="button" className="submit-button btn btn-success btn-md" onClick={this.handleClick.bind(this)}>Submit</button>
          </div>
          <div className="input-message"></div>
        </div>
      </div>

      <div className="row">
        <div className={error ? 'alert alert-danger col-sm-12' : 'collapse col-sm-12'}>{errorMessage}</div>
      </div>
      <div className="row">
        <div className="col-sm-9">
          {blogDetailList}
        </div>
        <div className="col-sm-3">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>PAST POSTS</th>
              </tr>
            </thead>
            <tbody>
              {blogList}
            </tbody>
          </table>
          
        </div>
      </div>
      
    </div>
  }
}