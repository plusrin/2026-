import { mkdir, writeFile, rm, access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
const route = new URL('../src/app/gallery-test-fixture/', import.meta.url);
try { await access(route); throw new Error('Temporary test route already exists; refusing to overwrite.'); }
catch(error){ if(error.code !== 'ENOENT') throw error; }
try {
 await mkdir(route);
 await writeFile(new URL('page.tsx',route), `import { Gallery } from '@/components/Gallery';
 const image=(label:string)=>'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="400" height="600" fill="ivory"/><text x="20" y="80">'+label+'</text></svg>');
 export default function Page(){return <main id="main" style={{paddingTop:100}}><Gallery label="테스트 전용 전시" items={[{id:'test-only',category:'scene',className:'테스트',student:'실제 학생 아님',title:'테스트 포스터',front:image('FRONT'),back:image('BACK')}]}/></main>}`);
 const code = await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['node_modules/@playwright/test/cli.js','test',...process.argv.slice(2)],{stdio:'inherit'});child.on('error',reject);child.on('exit',resolve);});
 process.exitCode=code??1;
} finally {
 await rm(route,{recursive:true,force:true});
 // The temporary route is gone; discard only generated dev route types.
 await rm(new URL('../.next/dev/types/', import.meta.url),{recursive:true,force:true});
}
