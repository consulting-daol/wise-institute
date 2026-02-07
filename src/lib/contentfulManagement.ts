import { createClient as createContentfulManagementClient } from 'contentful-management';
import sharp from 'sharp';

export async function createClient() {
  const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  if (!managementToken) {
    throw new Error('CONTENTFUL_MANAGEMENT_TOKEN is required');
  }
  return createContentfulManagementClient({ accessToken: managementToken });
}

export async function getManagementEnv() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';
  const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

  if (!spaceId || !managementToken) {
    throw new Error('Contentful env vars missing: CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN');
  }

  const client = createContentfulManagementClient({ accessToken: managementToken });
  const space = await client.getSpace(spaceId);
  const env = await space.getEnvironment(environmentId);
  return { env };
}

async function fileToWebpBuffer(file: File): Promise<{ buffer: Buffer; fileName: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const input = Buffer.from(arrayBuffer);
    
    // 이미지 리사이징 및 압축: 최대 너비 2000px, 높이는 비율 유지
    const webpBuffer = await sharp(input)
      .resize(2000, null, { 
        withoutEnlargement: true, // 작은 이미지는 확대하지 않음
        fit: 'inside' // 비율 유지하며 지정 크기 안에 맞춤
      })
      .webp({ quality: 100 }) // WISE Institute는 q=100 사용
      .toBuffer();
      
    const baseName = file.name.replace(/\.[^.]+$/, '');
    return { buffer: webpBuffer, fileName: `${baseName}.webp` };
  } catch (error: any) {
    console.error(`  ❌ Error processing image ${file.name}:`, error);
    throw new Error(`Failed to process image ${file.name}: ${error.message || 'Unknown error'}`);
  }
}

/** Upload image from base64 (e.g. canvas.toDataURL) - for auto-captured thumbnails */
export async function uploadImageFromBase64(env: any, base64Data: string, fileName: string) {
  try {
    const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const input = Buffer.from(base64, 'base64');
    const webpBuffer = await sharp(input)
      .resize(800, null, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 80 })
      .toBuffer();
    const webpFileName = fileName.replace(/\.[^.]+$/, '') + '.webp';

    const asset = await env.createAssetFromFiles({
      fields: {
        title: { 'en-US': webpFileName },
        file: {
          'en-US': {
            contentType: 'image/webp',
            fileName: webpFileName,
            file: webpBuffer,
          },
        },
      },
    });
    const processed = await asset.processForAllLocales();
    const published = await processed.publish();
    return published;
  } catch (error: any) {
    console.error('Error uploading from base64:', error);
    throw new Error(`Failed to upload thumbnail: ${error.message || 'Unknown error'}`);
  }
}

export async function uploadImage(env: any, file: File) {
  try {
    console.log(`  📸 Processing image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    const { buffer, fileName } = await fileToWebpBuffer(file);
    console.log(`  ✅ Converted to WebP: ${fileName} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
    
    console.log(`  📤 Creating asset in Contentful...`);
    const asset = await env.createAssetFromFiles({
      fields: {
        title: { 'en-US': fileName },
        file: {
          'en-US': {
            contentType: 'image/webp',
            fileName,
            file: buffer,
          },
        },
      },
    });
    console.log(`  ✅ Asset created: ${asset.sys.id}`);
    
    console.log(`  ⚙️ Processing asset...`);
    const processed = await asset.processForAllLocales();
    console.log(`  ✅ Asset processed`);
    
    console.log(`  📤 Publishing asset...`);
    const published = await processed.publish();
    console.log(`  ✅ Asset published: ${published.sys.id}`);
    
    return published;
  } catch (error: any) {
    console.error(`  ❌ Error uploading image ${file.name}:`, error);
    console.error(`  Error details:`, {
      message: error.message,
      name: error.name,
      statusCode: error.statusCode,
      statusText: error.statusText,
      requestId: error.requestId,
      details: error.details,
    });
    throw new Error(`Failed to upload image ${file.name}: ${error.message || 'Unknown error'}`);
  }
}

