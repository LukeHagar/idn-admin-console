import { c as createConfiguration, d as distExports, H as HandleError } from './sdk-9eeff2de.js';
import { b as getToken } from './oauth-017ba109.js';
import { j as json } from './index-64aa7a5e.js';
import './_commonjsHelpers-2155838d.js';
import 'url';
import 'http';
import 'https';
import 'util';
import 'zlib';
import 'stream';
import 'events';
import 'os';
import 'path';
import 'fs';
import 'assert';
import 'tty';
import 'buffer';
import 'crypto';

async function GET({ cookies }) {
  try {
    const session = JSON.parse(cookies.get("session"));
    const idnSession = await getToken(cookies);
    const config = createConfiguration(session.baseUrl, idnSession.access_token);
    let api = new distExports.SourcesApi(config);
    const val = (await distExports.Paginator.paginate(api, api.listSources, { limit: 100 }, 10)).data;
    return json(val);
  } catch (err) {
    HandleError("issue arose during SDK source query", err);
  }
}

export { GET };
//# sourceMappingURL=_server.ts-61ca2e72.js.map