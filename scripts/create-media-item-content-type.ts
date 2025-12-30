/**
 * Contentful에 mediaItem content type을 자동으로 생성하는 스크립트
 * 실행: npm run create-media-content-type
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// .env.local 파일 로드
config({ path: resolve(process.cwd(), '.env.local') });

import { getManagementEnv } from '../src/lib/contentfulManagement';

async function createMediaItemContentType() {
  try {
    console.log('📝 Contentful에 MediaItem content type 생성 시작...\n');
    
    const { env } = await getManagementEnv();
    
    // 기존 content type 확인
    try {
      const existing = await env.getContentType('mediaItem');
      console.log('✅ MediaItem content type이 이미 존재합니다.');
      console.log(`   ID: ${existing.sys.id}`);
      console.log(`   Name: ${existing.name}`);
      console.log(`   Published: ${existing.sys.publishedVersion ? 'Yes' : 'No'}`);
      
      if (!existing.sys.publishedVersion) {
        console.log('\n⚠️  Content type이 활성화되지 않았습니다. 활성화 중...');
        await existing.publish();
        console.log('✅ Content type이 활성화되었습니다.');
      }
      
      console.log('\n✅ 모든 설정이 완료되었습니다!');
      return;
    } catch (error: any) {
      // 404 에러는 content type이 없다는 의미이므로 생성 진행
      if (error.status === 404 || error.message?.includes('not found') || error.message?.includes('could not be found')) {
        console.log('📦 MediaItem content type을 생성합니다...\n');
      } else {
        throw error;
      }
    }
    
    // Content type 생성
    const contentType = await (env.createContentType as any)({
      sys: {
        id: 'mediaItem',
      },
      name: 'Media Item',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
          localized: false,
          validations: [],
        },
        {
          id: 'category',
          name: 'Category',
          type: 'Symbol',
          required: false,
          localized: false,
          validations: [],
        },
        {
          id: 'description',
          name: 'Description',
          type: 'Text',
          required: false,
          localized: false,
          validations: [],
        },
        {
          id: 'thumbnail',
          name: 'Thumbnail',
          type: 'Array',
          required: false,
          localized: false,
          validations: [],
          items: {
            type: 'Link',
            validations: [],
            linkType: 'Asset',
          },
        },
        {
          id: 'images',
          name: 'Images',
          type: 'Array',
          required: false,
          localized: false,
          validations: [],
          items: {
            type: 'Link',
            validations: [],
            linkType: 'Asset',
          },
        },
        {
          id: 'videos',
          name: 'Videos',
          type: 'Array',
          required: false,
          localized: false,
          validations: [],
          items: {
            type: 'Link',
            validations: [],
            linkType: 'Asset',
          },
        },
        {
          id: 'order',
          name: 'Order',
          type: 'Integer',
          required: false,
          localized: false,
          validations: [],
        },
      ],
    });
    
    console.log('✅ Content type 생성 완료');
    console.log(`   ID: ${contentType.sys.id}`);
    console.log(`   Name: ${contentType.name}`);
    
    // Content type 활성화
    console.log('\n📤 Content type 활성화 중...');
    const published = await contentType.publish();
    console.log('✅ Content type 활성화 완료!');
    console.log(`   Published Version: ${published.sys.publishedVersion}`);
    
    console.log('\n\n✅ MediaItem content type 생성 및 활성화 완료!');
    console.log('이제 동영상을 업로드할 수 있습니다.');
    
  } catch (error: any) {
    console.error('❌ 오류 발생:', error.message);
    if (error.details) {
      console.error('상세 정보:', JSON.stringify(error.details, null, 2));
    }
    if (error.requestId) {
      console.error('Request ID:', error.requestId);
    }
    process.exit(1);
  }
}

createMediaItemContentType();

