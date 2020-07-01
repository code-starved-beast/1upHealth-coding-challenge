export async function getServerSideProps({ res }) {
	return {
		props: res.viewProps
	};
}
