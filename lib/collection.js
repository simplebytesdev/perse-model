'use strict';

const Axios = require('axios');
const Qs = require('qs');

class PerseCollection {

  static get model() {

    throw new Error('Override static model getter');
  }

  static get urlRoot() {

    return this.model.urlRoot;
  }

  constructor() {

    this.models = [];
  }

  url() {

    return this.constructor.urlRoot;
  }

  async fetch(options = {}) {

    const response = await this.sync('read', {}, options);
    const parsedResponse = this.parse(response);
    this.addAll(parsedResponse);
    return this;
  }

  sync(method, data, options) {
    // TODO move to separate sync class
    options = options || {};
    if (method === 'create') {
      console.log('Posting', data);
      return Axios.post(this.url(), data, options);
    }
    else if (method === 'update') {
      console.log('Putting', data);
      return Axios.put(this.url(), data, options);
    }
    else if (method === 'read') {
      console.log('REading', method, this.url());
      let url = options.url || this.url();
      if (options.query) {
        url = url + `?${Qs.stringify(options.query)}`;
      }

      return Axios.get(url, options);
    }
    else if (method === 'delete') {
      return Axios.get(this.url(), data, options);
    }
  }

  parse(response) {

    console.log('Parsing', response.data);
    return response.data;
  }

  async create(modelData) {

    const model = this.constructor.model(modelData);
    await model.save();
    this.add(model);
  }

  addAll(models) {

    for (const modelData of models) {
      const model = new this.constructor.model(modelData);
      this.add(model);
    }
  }

  add(model) {

    this.models.push(model);
  }

  at(index) {

    return this.models[index];
  }

  get length() {

    return this.models.length;
  }

  get isCollection() {

    return true;
  }
}

module.exports = PerseCollection;