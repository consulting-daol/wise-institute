import 'dotenv/config';
import { createClient } from 'contentful';

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  console.error('❌ 오류: CONTENTFUL_SPACE_ID 또는 CONTENTFUL_ACCESS_TOKEN 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
  environment: CONTENTFUL_ENVIRONMENT,
});

async function testConnection() {
  console.log('🔍 Contentful 연결 테스트 시작...');
  console.log(`Space ID: ${CONTENTFUL_SPACE_ID}`);
  console.log(`Environment: ${CONTENTFUL_ENVIRONMENT}`);
  console.log(`Access Token: ${CONTENTFUL_ACCESS_TOKEN?.substring(0, 10) || 'not set'}...`);

  try {
    // 1. News Items 테스트
    console.log('\n📰 News Items 테스트:');
    const newsResponse = await client.getEntries({
      content_type: 'newsItem',
      include: 10,
    });
    console.log(`  - 총 ${newsResponse.items.length}개의 news item 발견`);
    if (newsResponse.items.length > 0) {
      const firstItem = newsResponse.items[0];
      console.log(`  - 첫 번째 항목 ID: ${firstItem.sys.id}`);
      console.log(`  - 첫 번째 항목 필드:`, Object.keys((firstItem.fields as any) || {}));
      const fields = (firstItem.fields as any) || {};
      if (fields.title) {
        console.log(`  - 제목: ${fields.title['en-US'] || fields.title}`);
      }
    }

    // 2. Media Items 테스트
    console.log('\n🎬 Media Items 테스트:');
    const mediaResponse = await client.getEntries({
      content_type: 'wiseInstitute',
      include: 10,
    });
    console.log(`  - 총 ${mediaResponse.items.length}개의 media item 발견`);
    if (mediaResponse.items.length > 0) {
      const firstItem = mediaResponse.items[0];
      console.log(`  - 첫 번째 항목 ID: ${firstItem.sys.id}`);
      console.log(`  - 첫 번째 항목 필드:`, Object.keys((firstItem.fields as any) || {}));
      const fields = (firstItem.fields as any) || {};
      if (fields.title) {
        console.log(`  - 제목: ${fields.title['en-US'] || fields.title}`);
      }
    }

    // 3. Published 상태 확인
    console.log('\n📋 Published 상태 확인:');
    const allNews = await client.getEntries({
      content_type: 'newsItem',
      'sys.publishedAt[exists]': true,
    } as any);
    console.log(`  - Published된 news items: ${allNews.items.length}개`);

    const allMedia = await client.getEntries({
      content_type: 'wiseInstitute',
      'sys.publishedAt[exists]': true,
    } as any);
    console.log(`  - Published된 media items: ${allMedia.items.length}개`);

    console.log('\n✅ 연결 테스트 완료!');
  } catch (error: any) {
    console.error('❌ 오류 발생:', error.message);
    if (error.response) {
      console.error('  Response status:', error.response.status);
      console.error('  Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

testConnection();

