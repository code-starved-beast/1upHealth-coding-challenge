import { create } from 'axios';

export default class FHIRClient {
	constructor({ userId, clientId, clientSecret }) {
		Object.assign(this, { userId, clientId, clientSecret });

		this.axios = create({ baseURL: 'https://api.1up.health' });
		this.axios.interceptors.request.use(config => {
			if (config.url.match('/fhir/dstu2/Patient')) {
				return { ...config, headers: this.authHeaders };
			} else {
				return config;
			}
		});
	}

	async generateAccessCode() {
		const { data: { code } } = await this.axios.post(
			'/user-management/v1/user/auth-code',
			{
				app_user_id: this.userId,
				client_id: this.clientId,
				client_secret: this.clientSecret
			}
		);

		this.accessCode = code;
	}

	async exchangeAccessCode() {
		const { data: { access_token, refresh_token } } = await this.axios.post(
			'/fhir/oauth2/token',
			{
				client_id: this.clientId,
				client_secret: this.clientSecret,
				code: this.accessCode,
				grant_type: 'authorization_code'
			}
		);

		this.accessToken = access_token;
		this.refreshToken = refresh_token;
	}

	async authenticate() {
		await this.generateAccessCode();
		await this.exchangeAccessCode();
	}

	async refreshAccessToken() {
		const { data: { access_token, refresh_token } } = await this.axios.post(
			'/fhir/oauth2/token',
			{
				client_id: this.clientId,
				client_secret: this.clientSecret,
				refresh_toekn: this.refreshToken,
				grant_type: 'refresh_token'
			}
		);

		this.accessToken = access_token;
		this.refreshToken = refresh_token;
	}

	async getPatient(patientId) {
		const { data } = await this.axios.get(`/fhir/dstu2/Patient/${patientId}`);
		return data;
	}

	async getEverythingForPatient(patientId, skip) {
		const { data } = await this.axios.get(`/fhir/dstu2/Patient/${patientId}/$everything`, skip && {
			params: {
				_skip: skip
			}
		});
		return data;
	}

	async listAllPatients(skip) {
		const { data } = await this.axios.get('/fhir/dstu2/Patient', skip && {
			params: {
				_skip: skip
			}
		});
		return data;
	}

	async createPatientResource(id, payload) {
		const { data } = await this.axios.post(`/fhir/dstu2/Patient/${id}`, payload);
		return data;
	}

	get authHeaders() {
		return { Authorization: `Bearer ${this.accessToken}` };
	}
}
