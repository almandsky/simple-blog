import { computed, observable } from "mobx"

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

export default Blog;