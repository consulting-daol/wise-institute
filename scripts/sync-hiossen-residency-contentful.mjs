/**
 * Sync DEFAULT_PROGRAMS (incl. Hiossen Residency) into Contentful programsSettings.
 * Usage: node --env-file=.env.local scripts/sync-hiossen-residency-contentful.mjs
 */
import contentfulManagement from 'contentful-management';
import contentful from 'contentful';
import { readFileSync } from 'node:fs';

const { createClient: createDeliveryClient } = contentful;

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const deliveryToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !managementToken) {
  console.error('Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN');
  process.exit(1);
}

const CONTENT_TYPE_ID = 'programsSettings';

function loadDefaultPrograms() {
  // Avoid importing programs.ts (pulls Next/contentful client). Parse the array literally.
  const src = readFileSync(new URL('../src/lib/programs.ts', import.meta.url), 'utf8');
  const match = src.match(
    /export const DEFAULT_PROGRAMS: Program\[\] = (\[[\s\S]*?\n\]);/
  );
  if (!match) throw new Error('Could not parse DEFAULT_PROGRAMS from programs.ts');
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${match[1]});`)();
}

function normalizePrograms(field) {
  if (Array.isArray(field)) return field;
  if (field && typeof field === 'object') {
    if (Array.isArray(field['en-US'])) return field['en-US'];
    // Sometimes CMA returns bare object with numeric keys
    const values = Object.values(field);
    if (values.length && values.every((v) => v && typeof v === 'object' && 'id' in v)) {
      return values;
    }
  }
  return [];
}

async function fetchDeliveryPrograms() {
  if (!deliveryToken) return [];
  try {
    const client = createDeliveryClient({
      space: spaceId,
      accessToken: deliveryToken,
      environment: environmentId,
    });
    const res = await client.getEntries({ content_type: CONTENT_TYPE_ID, limit: 1 });
    if (!res.items.length) return [];
    const field = res.items[0].fields?.programs;
    return normalizePrograms(field);
  } catch (err) {
    console.warn('Delivery fetch failed:', err.message);
    return [];
  }
}

const defaults = loadDefaultPrograms();
const deliveryPrograms = await fetchDeliveryPrograms();
console.log(
  'Delivery ids:',
  deliveryPrograms.map((p) => p.id).join(', ') || '(none / unpublished)'
);
console.log('DEFAULT ids:', defaults.map((p) => p.id).join(', '));

// Prefer DEFAULT as source of truth for this sync (includes Hiossen Residency + auto dates).
const merged = defaults;
const hasHiossen = merged.some((p) => p.id === 'hiossen-residency-2027');
if (!hasHiossen) {
  console.error('DEFAULT_PROGRAMS missing hiossen-residency-2027');
  process.exit(1);
}

const createClient = contentfulManagement.createClient;
const client = createClient({ accessToken: managementToken });
const space = await client.getSpace(spaceId);
const env = await space.getEnvironment(environmentId);
const response = await env.getEntries({ content_type: CONTENT_TYPE_ID, limit: 1 });

if (!response.items.length) {
  console.error('No programsSettings entry');
  process.exit(1);
}

let entry = response.items[0];
console.log(
  'Entry',
  entry.sys.id,
  'version',
  entry.sys.version,
  'publishedVersion',
  entry.sys.publishedVersion ?? 'unpublished'
);

// Always write locale-keyed object (CMA requires it for this field).
entry.fields.programs = { 'en-US': merged };
if (!entry.fields.internalTitle) {
  entry.fields.internalTitle = { 'en-US': 'Programs Settings' };
} else if (typeof entry.fields.internalTitle === 'string') {
  entry.fields.internalTitle = { 'en-US': entry.fields.internalTitle };
}

entry = await entry.update();
entry = await entry.publish();
console.log('OK: published', merged.length, 'programs including hiossen-residency-2027');
console.log('Published ids:', merged.map((p) => p.id).join(', '));
