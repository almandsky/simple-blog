import { computed, observable } from "mobx"
import axios from "axios";
import querystring from "querystring";

class Blog {
  @observable id;
  @observable text;
  @observable timestamp;
  @observable title;

  constructor(playload) {
    this.id = playload.id;
    this.text = playload.text;
    this.timestamp = playload.timestamp;
    this.title = playload.title;
  }
}

export class BlogStore {
  @observable blogs = []
  @observable testId = ""
  @observable error = false
  @observable errorMessage = "";


  getBlogs() {
    const self = this;
    
    const getBlogsUrl = `http://restedblog.herokuapp.com/spartz/api/`;
    axios.get(getBlogsUrl)
    .then(function (response) {
      console.log(response);
      self.blogs = [];
      const results = response.data;
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const blog = new Blog(result);
        self.blogs.push(blog);
      }
    })
    .catch(function (error) {
      self.error = true;
      self.errorMessage = error.toString();
    });
  }

  deleteBlog(blog) {
    const self = this;
    
    const deleteBlogUrl = `http://restedblog.herokuapp.com/spartz/api/${blog.id}`;
    axios.delete(deleteBlogUrl)
    .then(function (response) {
      const deletedPos = self.blogs.indexOf(blog);
      if (deletedPos >= 0) {
        self.blogs.splice(deletedPos, 1);
      }
    })
    .catch(function (error) {
      self.error = true;
      self.errorMessage = error.toString();
    });
  }

  createBlog(title, text) {
    const self = this;
    const createBlogUrl = `http://restedblog.herokuapp.com/spartz/api/`;
    // TODO: May need more defesive checking for the input title and text to prevent XSS
    axios.post(createBlogUrl, querystring.stringify({
            title: title,
            text: text
    }))
    .then(function (response) {
      const result = response.data;
      const blog = new Blog(result);
      self.blogs.splice(0, 0, blog);

    })
    .catch(function (error) {
      self.error = true;
      self.errorMessage = error.toString();
    });
  }

  updateBlog(oldBlog, title, text) {
    const self = this;
    const updateBlogUrl = `http://restedblog.herokuapp.com/spartz/api/${oldBlog.id}`;
    // TODO: May need more defesive checking for the input title and text to prevent XSS
    axios.post(updateBlogUrl, querystring.stringify({
      title: title,
      text: text
    }))
    .then(function (response) {

      const result = response.data;
      const newBlog = new Blog(result);

      const updatePos = self.blogs.indexOf(oldBlog);
      if (updatePos >= 0) {
        self.blogs.splice(updatePos, 1, newBlog);
      }

    })
    .catch(function (error) {
      self.error = true;
      self.errorMessage = error.toString();
    });
  }

}

export default new BlogStore
