import { ButtonGroup, Card } from 'react-bootstrap';
import { Resource } from '../../components';

export async function getServerSideProps({ req: { app: { fhirClient }, params, query } }) {
	const skip = query.page && (parseInt(query.page) - 1) * 10;
	const [patient, everything] = await Promise.all([
		fhirClient.getPatient(params.id),
		fhirClient.getEverythingForPatient(params.id, skip)
	]);
	const { entry, total } = everything;

	return {
		props: {
			resources: entry.map(({ resource }) => resource),
			patient,
			currentPage: query.page ? parseInt(query.page) : 1,
			lastPage: Math.floor(total / 10) + 1,
			patientId: params.id
		}
	};
}

export default function PatientView({ resources, patient, currentPage, lastPage, patientId }) {
	return (
		<Card>
			<Card.Header id="header">
				<Card.Title>{patient.name[0].text}</Card.Title>
				<Card.Text>
					<a href="/patients">View All Patients</a>
				</Card.Text>
				<Card.Text>
					<a href="#footer">Jump to bottom</a>
				</Card.Text>
			</Card.Header>
			<Card.Body>
				{resources.map(resource => (
					<Resource
						key={resource.identifier[0].value}
						content={resource}
						title={resource.resourceType.replace(/(?=[A-Z])/g, ' ')}
					/>
				))}
			</Card.Body>
			<Card.Footer id="footer">
				<Card.Text>
					<a href="#header">Back to Top</a>
				</Card.Text>
				<ButtonGroup>
					{currentPage > 1 &&
						<a
							href={`/patients/${patientId}?page=${currentPage - 1}`}
							className="btn btn-primary"
						>&lt;&nbsp;Previous Page</a>
					}
					{currentPage < lastPage &&
						<a
							className="btn btn-primary"

							href={`/patients/${patientId}?page=${currentPage + 1}`}
						>Next Page&nbsp;&gt;</a>
					}
				</ButtonGroup>
			</Card.Footer>
		</Card>
	);
}