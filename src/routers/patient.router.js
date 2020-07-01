import { Router } from 'express';
import { asyncMiddlewareWrapper } from '../util';

const patientRouter = Router();

patientRouter.get('/:id',
	({ query: { page } }, res, next) => {
		if (page && parseInt(page) < 1) {
			res.sendStatus(422);
		} else {
			next()
		}
	},
	asyncMiddlewareWrapper(async (req, res) => {
		const { app: { fhirClient }, params, query } = req; 
		const skip = query.page && (parseInt(query.page) - 1) * 10;
		const [patient, everything] = await Promise.all([
			fhirClient.getPatient(params.id),
			fhirClient.getEverythingForPatient(params.id, skip)
		]);
		const { entry, total } = everything;

		res.viewProps = {
			resources: entry.map(({ resource }) => resource),
			patient,
			currentPage: query.page ? parseInt(query.page) : 1,
			lastPage: Math.floor(total / 10) + 1,
			patientId: params.id
		};

		req.app.next.render(req, res, `/patients/${req.params.id}`);
	})
);

patientRouter.get('/', asyncMiddlewareWrapper(async (req, res) => {
	const { entry } = await req.app.fhirClient.listAllPatients();

	const patients = entry
		.map(({ resource }) => resource)
		.filter(({ resourceType }) => resourceType === 'Patient');

	res.viewProps = { patients };

	req.app.next.render(req, res, `/patients`);
}));

export default patientRouter;
