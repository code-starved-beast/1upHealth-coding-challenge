import React from 'react';
import { Card, ListGroup } from 'react-bootstrap'

export { getServerSideProps } from '../../view-helpers';

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
							<a href={`/patients/${patient.id}`}>{patient.name.map(({ text }) => text).join('/')}</a>
						</ListGroup.Item>
					))}
				</ListGroup>
			</Card.Body>
		</Card>
	);
}