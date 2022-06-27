const fs = require(`fs`);
const tourController = require(`./../controllers/tourController`);


const express = require(`express`);

const router = express.Router();

<<<<<<< HEAD
router.param(`id`, tourController.checkID);
=======
router.param(`id`, (req, res, next, val) => {
    console.log(`Tour ID is ${val}`);
    next()
})
>>>>>>> c0ab9f69ff290cdc6755d6e03dcc373684a61b79


router.route(`/`).get(tourController.getAllTours).post(tourController.createTour);
router.route(`/:id`).get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;
