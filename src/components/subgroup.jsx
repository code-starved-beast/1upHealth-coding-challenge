import { ListGroup } from 'react-bootstrap';
import { toPairs, isString, isArray, isNumber, isNaN } from 'lodash';

export default function Subgroup({ content }) {
	return (
		<ListGroup>
			{toPairs(content).map(([key, value]) => (
				<ListGroup.Item key={key}>
					{isNaN(parseInt(key)) && <b>{key}:&nbsp;</b>}
					{
						isString(value) || isNumber(value) ? value :
							isArray(value) ? value.map((subContent, index) => (
								<Subgroup
									key={`${key}-${index}`}
									content={subContent}
								/>
							)) : <Subgroup content={value}/>
					}
				</ListGroup.Item>
			))}
		</ListGroup>
	);
}