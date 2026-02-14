'use server'

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function saveCMSData(data: any) {
  try {
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const contentPath = path.join(dataDir, 'content.json');
    
    await mkdir(dataDir, { recursive: true });
    
    await writeFile(
      contentPath,
      JSON.stringify(data, null, 2),
      'utf-8'
    );
    
    return { success: true };
  } catch (error) {
    console.error('Save error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
