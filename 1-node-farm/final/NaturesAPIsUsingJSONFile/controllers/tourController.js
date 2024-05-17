const fs = require('fs');
let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/data.json`, 'utf-8')
);

exports.deleteTour = (req, res) => {
  let id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'tours not found',
    });
  }

  delete tours[id];
  console.log('tour deleted');
  fs.writeFile(
    `${__dirname}/../data/data.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: {},
      });
    }
  );
};

exports.getAllTours = function (req, res) {
  res.status(200).json({
    status: 'sucess',
    total: tours.length,
    data: {
      ...tours,
    },
  });
};

exports.getTourById = (req, res) => {
  let id = req.params.id * 1;
  let tour = tours.find((ele) => ele.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      ...tour,
    },
  });
};

exports.updateTourById = (req, res) => {
  let id = req.params.id * 1;
  let tour = tours.find((item) => item.id === id);
  console.log('this is patch request');
  console.log(tour);
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'No tour Available with given ID',
    });
  }

  Object.keys(tour).forEach((key) => {
    Object.keys(req.body).forEach((key1) => {
      if (key1 === key) {
        tour[key] = req.body[key1];
      }
    });
  });

  tours[tour.id] = tour;

  fs.writeFile(
    `${__dirname}/../data/data.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          ...tour,
        },
      });
    }
  );
};

exports.createTour = function (req, res) {
  if (!tours[tours.length - 1]) {
    return res.status(404).json({
      status: 'failed',
      message: 'unable to create the new tour',
    });
  }

  let newId = tours[tours.length - 1].id + 1;
  let newTour = {
    id: newId,
    ...req.body,
  };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../data/data.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          ...newTour,
        },
      });
    }
  );
};
//}

//module.exports = new Tours(tours);
