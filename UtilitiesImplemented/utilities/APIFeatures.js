const tourModel = require('./../models/toursModel');
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Filtering and Preparing query Object
    let queryObj = { ...this.queryString };
    console.log('the query string is : ', queryObj);
    let excludeParamsArray = ['page', 'sort', 'limit', 'fields'];
    excludeParamsArray.forEach((ele) => delete queryObj[ele]);

    //Advanced Filter
    let querySting = JSON.stringify(queryObj);
    let advancedQueryString = querySting.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    //getting filter Query
    this.query = tourModel.find(JSON.parse(advancedQueryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortStr = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortStr);
    } else {
      this.query = this.query.sort('-ratingsAverage');
    }

    return this;
  }

  limit() {
    if (this.queryString.fields) {
      let fieldsStr = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldsStr);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  pagination() {
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 100;
    let skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
