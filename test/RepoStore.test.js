'use strict';

import { expect } from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import RepoStore from '../src/js/RepoStore';

describe('RepoStore', function testRepoStore() {
  it('should get list of repo', function testGetRepos() {
    let mockAdapter = new MockAdapter(axios);
    mockAdapter.onGet('https://api.github.com/users/username/repos').reply(200, {
       data: [
        {
          "id": 52118783,
          "name": "chatlive",
          "html_url": "https://github.com/almandsky/chatlive",
          "description": "chat with friends based on the content context",
          "url": "https://api.github.com/repos/almandsky/chatlive"
        }
       ]
     });

    RepoStore.getRepos('username');
    setTimeout(() => {
        var result = response.data[0];
        expect(result.id).to.be.equal(52118783);
        expect(result.name).to.be.equal('chatlive');
     }, 0)
  });
});
