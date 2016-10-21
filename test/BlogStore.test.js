'use strict';

import { expect } from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BlogStore } from '../src/js/BlogStore';
import Blog from '../src/js/Blog';

describe('BlogStore', function testBlogStore() {
  it('should get list of blogs', function testGetBlogs(done) {
    let mockAdapter = new MockAdapter(axios, { delayResponse: 0 });
    mockAdapter.onGet('http://rest.learncode.academy/api/almandsky/blogs/').reply(200, [
        {
          "id": 52118783,
          "title": "Test Blog Title",
          "text": "The blog content text",
          "timestamp": "Thu Oct 20 2016 21:30:32 GMT+0000 (UTC)"
        },
        {
          "id": 522434123,
          "title": "Test Blog Title 2",
          "text": "The blog content text 2",
          "timestamp": "Thu Oct 21 2016 21:30:32 GMT+0000 (UTC)"
        }
       ]
     );

    const store = new BlogStore;
    expect(store.blogs.length).to.be.equal(0);
    store.getBlogs();
    setTimeout(() => {
      expect(store.blogs.length).to.be.equal(2);
      expect(store.blogs[0].id).to.be.equal(52118783);
      done();
    }, 0);
  });

  it('should create a blog post', function testCreateBlogs(done) {
    let mockAdapter = new MockAdapter(axios, { delayResponse: 0 });
    mockAdapter.onPost('http://rest.learncode.academy/api/almandsky/blogs/').reply(200, {
        "id": 52118789,
        "title": "New Test Blog Title",
        "text": "New test blog content text",
        "timestamp": "Thu Oct 22 2016 21:30:32 GMT+0000 (UTC)"
      }
     );

    const store = new BlogStore;
    expect(store.blogs.length).to.be.equal(0);
    store.createBlog('New Test Blog Title', 'New test blog content text');

    setTimeout(() => {
      expect(store.blogs.length).to.be.equal(1);
      var blog = store.blogs[0];
      expect(blog.title).to.be.equal('New Test Blog Title');
      expect(blog.text).to.be.equal('New test blog content text');
      done();
    }, 0);
  });

  it('should update a blog post', function testUpdateBlogs(done) {
    let mockAdapter = new MockAdapter(axios, { delayResponse: 0 });
    mockAdapter.onPut('http://rest.learncode.academy/api/almandsky/blogs/52118789').reply(200, {
        "id": 52118789,
        "title": "New Test Blog Title",
        "text": "New test blog content text",
        "timestamp": "Thu Oct 22 2016 21:30:32 GMT+0000 (UTC)"
      }
    );

    const store = new BlogStore;
    var blog = new Blog({
      "id": 52118789,
      "title": "Test Blog Title",
      "text": "test blog content text",
      "timestamp": "Thu Oct 22 2016 21:30:32 GMT+0000 (UTC)"
    });
    store.blogs.push(blog);
    expect(store.blogs.length).to.be.equal(1);
    store.updateBlog(blog, 'New Test Blog Title', 'New test blog content text');

    setTimeout(() => {
      expect(store.blogs.length).to.be.equal(1);
      var blog = store.blogs[0];
      expect(blog.title).to.be.equal('New Test Blog Title');
      expect(blog.text).to.be.equal('New test blog content text');
      done();
    }, 0);
  });

  it('should delete a blog post', function testDeleteBlogs(done) {
    let mockAdapter = new MockAdapter(axios, { delayResponse: 0 });
    mockAdapter.onDelete('http://rest.learncode.academy/api/almandsky/blogs/52118789').reply(200, {
      data: 'OK'
    });

    const store = new BlogStore;
    var blog = new Blog({
      "id": 52118789,
      "title": "Test Blog Title",
      "text": "test blog content text",
      "timestamp": "Thu Oct 22 2016 21:30:32 GMT+0000 (UTC)"
    });
    store.blogs.push(blog);
    expect(store.blogs.length).to.be.equal(1);
    store.deleteBlog(blog);

    setTimeout(() => {
      expect(store.blogs.length).to.be.equal(0);
      done();
    }, 0);
  });
});
