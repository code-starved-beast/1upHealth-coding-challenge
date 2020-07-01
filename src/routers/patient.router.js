import { Router } from 'express';
import { asyncMiddlewareWrapper } from '../util';

const patientRouter = Router();

patientRouter.get('/:id',
	({ query: { page }}, res, next) => {
		if (page && parseInt(page) < 1) {
			res.sendStatus(422);
		} else {
			next()
		}
	},
	asyncMiddlewareWrapper(async (req, res) => {
		req.app.next.render(req, res, `/patients/${req.params.id}`);
	})
);

patientRouter.get('/', asyncMiddlewareWrapper(async (req, res) => {
	req.app.next.render(req, res, `/patients`);
}));

export default patientRouter;
