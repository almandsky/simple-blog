import { computed, observable } from "mobx"
import axios from "axios";
import querystring from "querystring";
import Blog from "./Blog";

const baseUrl = 'http://rest.learncode.academy/api/almandsky/blogs/';

export class BlogStore {
  @observable blogs = []
  @observable testId = ""
  @observable error = false
  @observable errorMessage = "";


  getBlogs() {
    const self = this;
    
    const getBlogsUrl = `${baseUrl}`;
    axios.get(getBlogsUrl)
    .then(function (response) {
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
    
    const deleteBlogUrl = `${baseUrl}${blog.id}`;
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
    const createBlogUrl = `${baseUrl}`;
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
    const updateBlogUrl = `${baseUrl}${oldBlog.id}`;
    // TODO: May need more defesive checking for the input title and text to prevent XSS
    axios.put(updateBlogUrl, {
      title: title,
      text: text
    })
    .then(function (response) {
      const newBlog = new Blog({
        id: oldBlog.id,
        title: title,
        text: text,
        timestamp: oldBlog.timestamp
      });

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
