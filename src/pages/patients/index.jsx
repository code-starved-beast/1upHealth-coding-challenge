import React from 'react';
import { Card, ListGroup } from 'react-bootstrap'
import Link from 'next/link';

export async function getServerSideProps(context) {
	const { entry } = await context.req.app.fhirClient.listAllPatients();

	const patients = entry
		.map(({ resource }) => resource)
		.filter(({ resourceType }) => resourceType === 'Patient');

	return {
		props: { patients }
	};
}

export default function Index({ patients }) {
	return (
		<Card>
			<Card.Header>
				<Card.Title>All Patients</Card.Title>
			</Card.Header>
			<Card.Body>
				<ListGroup>
					{patients.map(patient => (
						<ListGroup.Item key={patient.id}>
							<Link href={`/patients/${patient.id}`}><a>{patient.name.map(({ text }) => text).join('/')}</a></Link>
						</ListGroup.Item>
					))}
				</ListGroup>
			</Card.Body>
		</Card>
	);
}