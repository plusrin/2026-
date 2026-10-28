import { test, expect } from '@playwright/test';

test('Bookk Light and Bold load for Korean text on mobile and desktop without system-font substitution', async ({page, browserName}) => {
 test.setTimeout(60000);
 for (const width of [390,1440]) {
  await page.setViewportSize({width,height:900});
  await page.goto('/readings?reading=2');
  await expect(page.locator('.reader-count')).toHaveText('2 / 15');
  const faces=await page.evaluate(async()=>{
   await Promise.all([document.fonts.load('300 18px BookkMyungjo','가장 먼 항해'),document.fonts.load('700 18px BookkMyungjo','젊은 베르테르의 슬픔')]);
   await document.fonts.ready;
   return Array.from(document.fonts).filter(f=>f.family.replaceAll('"','')==='BookkMyungjo').map(f=>({weight:f.weight,status:f.status}));
  });
  expect(faces).toEqual(expect.arrayContaining([{weight:'300',status:'loaded'},{weight:'700',status:'loaded'}]));
  await expect(page.locator('.reading-paper')).toHaveCSS('font-family',/BookkMyungjo/);
  await expect(page.locator('.reading-paper h2')).toHaveCSS('font-weight','700');
  await expect(page.locator('.letter-date')).toHaveCSS('font-weight','700');
  await expect(page.locator('.page-intro h1')).toHaveCSS('font-family',/BookkMyungjo/);
  if(browserName==='chromium'){
   const session=await page.context().newCDPSession(page);
   await session.send('DOM.enable');await session.send('CSS.enable');
   const {root}=await session.send('DOM.getDocument');
   for(const [selector,postscript] of [['.reader-name','BookkMyungjo-Lt'],['.reading-paper h2','BookkMyungjo-Bd']]){
    const {nodeId}=await session.send('DOM.querySelector',{nodeId:root.nodeId,selector});
    const {fonts}=await session.send('CSS.getPlatformFontsForNode',{nodeId});
    expect(fonts.some((f:{isCustomFont:boolean;postScriptName:string;glyphCount:number})=>f.isCustomFont&&f.postScriptName===postscript&&f.glyphCount>0),`${selector} must actually render the uploaded face`).toBe(true);
    expect(fonts.filter((f:{isCustomFont:boolean;glyphCount:number})=>!f.isCustomFont&&f.glyphCount>0)).toHaveLength(0);
   }
   await session.detach();
  }
  await page.getByRole('button',{name:'글자 크게',exact:true}).click();await expect(page.locator('.reading-paper')).toHaveCSS('font-size','20px');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
