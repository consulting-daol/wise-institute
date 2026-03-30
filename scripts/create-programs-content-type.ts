/**
 * Contentful에 programsSettings content type을 생성하고
 * 기본 프로그램 데이터(DEFAULT_PROGRAMS)로 초기 entry를 세팅하는 스크립트
 *
 * 실행: npm run create-programs-content-type
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { getManagementEnv } from '../src/lib/contentfulManagement';
import { DEFAULT_PROGRAMS } from '../src/lib/programs';

const CONTENT_TYPE_ID = 'programsSettings';

async function main() {
  console.log('🚀 programsSettings Contentful 구축 시작...\n');

  const { env } = await getManagementEnv();

  // ─── 1. Content Type ───────────────────────────────────────────────────────

  let contentType: any;

  try {
    contentType = await env.getContentType(CONTENT_TYPE_ID);
    console.log('ℹ️  Content type이 이미 존재합니다:', contentType.sys.id);

    if (!contentType.sys.publishedVersion) {
      console.log('   활성화되지 않음 → 활성화 중...');
      contentType = await contentType.publish();
      console.log('✅ Content type 활성화 완료');
    } else {
      console.log('✅ Content type 이미 활성화됨');
    }
  } catch (err: any) {
    const isNotFound =
      err.status === 404 ||
      err.message?.includes('not found') ||
      err.message?.includes('could not be found') ||
      err.name === 'NotFound';

    if (!isNotFound) throw err;

    // 잘못된 ID로 생성된 content type이 있으면 정리
    try {
      const allTypes = await env.getContentTypes({ limit: 200 });
      for (const ct of allTypes.items) {
        if ((ct as any).name === 'Programs Settings' && ct.sys.id !== CONTENT_TYPE_ID) {
          console.log(`🗑️  잘못된 ID의 content type 삭제: ${ct.sys.id}`);
          try {
            if ((ct as any).isPublished?.()) await ct.unpublish();
          } catch {}
          await ct.delete();
          console.log('✅ 삭제 완료');
        }
      }
    } catch {}

    console.log('📦 programsSettings content type을 새로 생성합니다...');

    contentType = await (env as any).createContentTypeWithId(CONTENT_TYPE_ID, {
      name: 'Programs Settings',
      displayField: 'internalTitle',
      fields: [
        {
          id: 'internalTitle',
          name: 'Internal Title',
          type: 'Symbol',
          required: true,
          localized: false,
          validations: [],
        },
        {
          id: 'programs',
          name: 'Programs',
          type: 'Object',
          required: false,
          localized: false,
          validations: [],
        },
      ],
    });

    console.log('✅ Content type 생성 완료:', contentType.sys.id);

    contentType = await contentType.publish();
    console.log('✅ Content type 활성화 완료 (v' + contentType.sys.publishedVersion + ')');
  }

  // ─── 2. Entry ──────────────────────────────────────────────────────────────

  console.log('\n📋 기존 entry 확인 중...');

  const existing = await env.getEntries({
    content_type: CONTENT_TYPE_ID,
    limit: 1,
  });

  if (existing.items.length > 0) {
    console.log('ℹ️  Entry가 이미 존재합니다. 건너뜁니다.');
    console.log(
      '   프로그램 수:',
      ((existing.items[0].fields as any).programs?.['en-US'] ?? []).length
    );
  } else {
    console.log('📝 기본 프로그램 데이터로 entry 생성 중...');

    const entry = await env.createEntry(CONTENT_TYPE_ID, {
      fields: {
        internalTitle: { 'en-US': 'Programs Settings' },
        programs: { 'en-US': DEFAULT_PROGRAMS },
      },
    });

    await entry.publish();
    console.log('✅ Entry 생성 및 활성화 완료');
    console.log(`   프로그램 수: ${DEFAULT_PROGRAMS.length}개 로드됨`);
    DEFAULT_PROGRAMS.forEach((p, i) =>
      console.log(`   ${i + 1}. [${p.type}] ${p.title} (${p.startDate})`)
    );
  }

  console.log('\n🎉 완료! 이제 어드민에서 Programs 탭을 정상적으로 사용할 수 있습니다.');
}

main().catch((err) => {
  console.error('❌ 오류 발생:', err.message || err);
  if (err.details) {
    console.error('상세 정보:', JSON.stringify(err.details, null, 2));
  }
  process.exit(1);
});
