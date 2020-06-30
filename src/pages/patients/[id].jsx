import { Card } from 'react-bootstrap';
import Link from 'next/link';
import { ResourceGroup } from '../../components';

export async function getServerSideProps(context) {
	const [patient, everything] = await Promise.all([
		context.req.app.fhirClient.getPatient(context.req.params.id),
		context.req.app.fhirClient.getEverythingForPatient(context.req.params.id)
	]);

	const resources = everything.entry.map(({ resource }) => resource)

	return {
		props: {
			resources,
			patient
		}
	};
}

export default function PatientView({ resources, patient }) {
	return (
		<Card>
			<Card.Header>
				<Card.Title>{patient.name[0].text}</Card.Title>
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
			<Card.Footer>
				<Link href="/patients"><a>View All Patients</a></Link>
			</Card.Footer>
		</Card>
	)
}