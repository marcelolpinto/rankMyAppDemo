const express = require('express');

const controller = require('./controllers/alert.controller');


class Routes {
	constructor(mailer) {
		this.mailer = mailer;
		this.router = null;
	}

	init() {
		const router = express.Router();

		router.route('/')
			.get(controller.getAlerts)
			.put(controller.updateAlert)
		 	.post(controller.addAlert);

		router.route('/:id')
		  .get(controller.getAlert)
		  .delete(controller.deleteAlert);

		router.route('/email').post((req, res) => controller.sendEmail(req, res, this.mailer))

		this.router = router;
	}
}


module.exports = Routes;