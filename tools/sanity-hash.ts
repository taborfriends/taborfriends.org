import { createClient } from '@sanity/client';
import { createHash } from 'node:crypto';

async function getTimestamps() {
  const DB_CLIENT = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2026-11-15',
    useCdn: false, // make sure you skip the cdn
  });

  const query = `*[_type == "navbar" || _type == "page"]{_updatedAt}`;
  return await DB_CLIENT.fetch(query);
}

getTimestamps().then((results) => {
  const hash = createHash('sha256');
  for (const record of results) {
    hash.update(record._updatedAt);
  }
  // logging to stdout so Nx knows about it.
  console.log(hash.digest('hex'));
});
