import { Card } from 'react-bootstrap';
import Subgroup from './subgroup';

export default function Resource({ content, title }) {
	return (
		<Card>
			<Card.Header>
				<Card.Title>{title}</Card.Title>
			</Card.Header>
			<Card.Body>
				<Subgroup content={content} />
			</Card.Body>
		</Card>
	);
}