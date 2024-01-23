import type { Cookies } from '@sveltejs/kit';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';

export function generateAuthLink(tenantUrl: string) {
	return `${tenantUrl}/oauth/authorize?client_id=sailpoint-cli&response_type=code&redirect_uri=http://localhost:3000/callback`;
}

export type IdnSession = {
	access_token: string;
	refresh_token: string;
	claims_supported: string;
	expires_in: string;
	identity_id: string;
	internal: string;
	jti: string;
	org: string;
	pod: string;
	scope: string;
	strong_auth: string;
	strong_auth_supported: string;
	tenant_id: string;
	token_type: string;
};

export interface TokenDetails {
	tenant_id: string;
	internal: boolean;
	pod: string;
	org: string;
	identity_id: string;
	user_name: string;
	strong_auth: boolean;
	force_auth_supported: boolean;
	active: boolean;
	authorities: string[];
	client_id: string;
	encoded_scope: string[];
	strong_auth_supported: boolean;
	claims_supported: boolean;
	scope: string[];
	exp: number;
	jti: string;
}

export async function checkToken(apiUrl: string, token: string): Promise<TokenDetails> {
	const body = 'token=' + token;
	const url = `${apiUrl}/oauth/check_token/`;
	const response = await axios.post(url, body).catch(function (err) {
		if (err.response) {
			// Request made and server responded
			console.log(err.response.data);
			console.log(err.response.status);
			console.log(err.response.headers);
		}
		return undefined;
	});
	// if (response) {
	// 	console.log(response.data);
	// }
	const tokenDetails = response!.data;
	return tokenDetails;
}

export async function refreshToken(apiUrl: string, refreshToken: string): Promise<IdnSession> {
	const url = `${apiUrl}/oauth/token?grant_type=refresh_token&client_id=sailpoint-cli&refresh_token=${refreshToken}`;
	const response = await axios.post(url).catch(function (err) {
		if (err.response) {
			// Request made and server responded
			console.log(err.response.data);
			console.log(err.response.status);
			console.log(err.response.headers);
		}
		return undefined;
	});
	// if (response) {
	// 	console.log(response.data)
	// }
	const idnSession: IdnSession = response!.data as IdnSession;
	return idnSession;
}

export async function getToken(cookies: Cookies): Promise<IdnSession> {
	const idnSession = <IdnSession>JSON.parse(cookies.get('idnSession')!);
	const session = JSON.parse(cookies.get('session')!);
	if (!idnSession && session) {
		redirect(302, generateAuthLink(session.tenantUrl));
	}
	if (!idnSession && !session) {
		redirect(302, '/');
	}
	if (isJwtExpired(idnSession.access_token)) {
		console.log('Refreshing IdnSession token...');
		const newSession = await refreshToken(session.baseUrl, idnSession.refresh_token);
		cookies.set('idnSession', JSON.stringify(newSession), {
			path: '/'
		});
		return Promise.resolve(newSession);
	} else {
		console.log('IdnSession token is good');
		return Promise.resolve(idnSession);
	}
}

function isJwtExpired(token: string): boolean {
	try {
		const decodedToken = jwt.decode(token, { complete: true });
		if (!decodedToken || !decodedToken.payload || !decodedToken.payload.exp) {
			// The token is missing the expiration claim ('exp') or is not a valid JWT.
			return true; // Treat as expired for safety.
		}

		// Get the expiration timestamp from the token.
		const expirationTimestamp = decodedToken.payload.exp;

		// Get the current timestamp.
		const currentTimestamp = Math.floor(Date.now() / 1000);

		// Check if the token has expired.
		return currentTimestamp >= expirationTimestamp;
	} catch (error) {
		// An error occurred during decoding.
		return true; // Treat as expired for safety.
	}
}
