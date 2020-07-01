import { ButtonGroup, Card } from 'react-bootstrap';
import Link from 'next/link';
import { ResourceGroup } from '../../components';

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
					<Link href="/patients"><a>View All Patients</a></Link>
				</Card.Text>
				<Card.Text>
					<a href="#footer">Jump to bottom</a>
				</Card.Text>
			</Card.Header>
			<Card.Body>
				{resources.map(resource => (
					<ResourceGroup
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
						<Link
							href={`/patients/${patientId}?page=${currentPage - 1}`}
							passHref
						>
							<a className="btn btn-primary">&lt;&nbsp;Previous Page</a>
						</Link>
					}
					{currentPage < lastPage &&
						<Link
							href={`/patients/${patientId}?page=${currentPage + 1}`}
							passHref
						>
							<a className="btn btn-primary">Next Page&nbsp;&gt;</a>
						</Link>
					}
				</ButtonGroup>
			</Card.Footer>
		</Card>
	);
}