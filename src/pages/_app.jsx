import { Container } from 'react-bootstrap';
import 'bootstrap-css-only/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
	return (
		<Container fluid>
			<Component {...pageProps} />
		</Container>
	);
}

export default MyApp;