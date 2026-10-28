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

test('all 15 contents entries use real Bookk Light for dates, summaries and students without changing scrolling',async({page,browserName})=>{
 test.setTimeout(60000);
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});await page.goto('/readings');await page.evaluate(()=>document.fonts.ready);
  for(const selector of ['.voyage-tabs a','.page-description','.reader-toolbar button','.reader-count']){
   const nodes=page.locator(selector);
   for(let i=0;i<await nodes.count();i++)await expect(nodes.nth(i)).toHaveCSS('font-family',/BookkMyungjo/);
  }
  await expect(page.locator('.page-intro .eyebrow')).toHaveCSS('font-family',/BookkMyungjo/);
  await page.getByRole('button',{name:'전체 목차',exact:false}).click();
  const dialog=page.getByRole('dialog');await expect(dialog.locator('.toc-list li')).toHaveCount(15);
  await expect(dialog).toHaveCSS('overflow-y','auto');
  const nodes=dialog.locator('.toc-date,.toc-summary,.toc-student');
  await expect(nodes).toHaveCount(43); // 15 summaries + 15 students + 13 source dates.
  for(let i=0;i<43;i++){
   await expect(nodes.nth(i)).toHaveCSS('font-family',/BookkMyungjo/);
   await expect(nodes.nth(i)).toHaveCSS('font-weight','300');
  }
  if(browserName==='chromium'){
   const session=await page.context().newCDPSession(page);await session.send('DOM.enable');await session.send('CSS.enable');
   const {root}=await session.send('DOM.getDocument');
   for(let i=1;i<=15;i++)for(const cls of ['toc-date','toc-summary','toc-student']){
    const selector=`.toc-list li:nth-child(${i}) .${cls}`;
    if(!await dialog.locator(selector).count())continue;
    const {nodeId}=await session.send('DOM.querySelector',{nodeId:root.nodeId,selector});
    const {fonts}=await session.send('CSS.getPlatformFontsForNode',{nodeId});
    expect(fonts.some((f:{isCustomFont:boolean;postScriptName:string;glyphCount:number})=>f.isCustomFont&&f.postScriptName==='BookkMyungjo-Lt'&&f.glyphCount>0),`${width}px item ${i} ${cls}: actual uploaded Light font`).toBe(true);
    expect(fonts.filter((f:{isCustomFont:boolean;glyphCount:number})=>!f.isCustomFont&&f.glyphCount>0)).toHaveLength(0);
   }
   await session.detach();
  }
  const last=dialog.locator('.toc-list li').last();await last.scrollIntoViewIfNeeded();
  expect(await dialog.evaluate(el=>el.scrollTop>0)).toBe(true);
  await last.getByRole('button').click();await expect(page.locator('.reader-count')).toHaveText('15 / 15');
  await expect(page.getByRole('dialog')).toHaveCount(0);
 }
});

test('all rendered site text, English/Korean song and both dialogs use actual Bookk faces',async({page,browserName})=>{
 test.setTimeout(90000);
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/schedule','/readings','/archive','/next']){
   await page.goto(route);
   async function audit(){
    await page.evaluate(()=>document.fonts.ready);
    const nodes=await page.evaluate(()=>{
     return Array.from(document.body.querySelectorAll<HTMLElement>('*')).filter(el=>
      !['SCRIPT','STYLE','NEXTJS-PORTAL'].includes(el.tagName)&&!el.closest('nextjs-portal')&&el.getClientRects().length>0&&parseFloat(getComputedStyle(el).fontSize)>0&&
      Array.from(el.childNodes).some(node=>node.nodeType===Node.TEXT_NODE&&node.textContent?.trim())).map(el=>{
       const path=[];let current:Element|null=el;
       while(current&&current!==document.body){path.unshift(`${current.tagName.toLowerCase()}:nth-child(${Array.from(current.parentElement!.children).indexOf(current)+1})`);current=current.parentElement;}
       return {selector:'body>'+path.join('>'),family:getComputedStyle(el).fontFamily};
      });
    });
    for(const node of nodes)expect(node.family).toContain('BookkMyungjo');
    if(browserName==='chromium'){
     const session=await page.context().newCDPSession(page);await session.send('DOM.enable');await session.send('CSS.enable');
     const {root}=await session.send('DOM.getDocument');
     for(const node of nodes){
      const {nodeId}=await session.send('DOM.querySelector',{nodeId:root.nodeId,selector:node.selector});
      const {fonts}=await session.send('CSS.getPlatformFontsForNode',{nodeId});
      const used=fonts.filter((f:{glyphCount:number})=>f.glyphCount>0);
      expect(used.length,`${width}px ${route}: text must have rendered glyphs`).toBeGreaterThan(0);
      for(const font of used)expect(font.isCustomFont&&['BookkMyungjo-Lt','BookkMyungjo-Bd'].includes(font.postScriptName),`${width}px ${route}: unexpected font ${font.postScriptName} on ${node.selector}`).toBe(true);
     }
     await session.detach();
    }
   }
   await audit();
   if(route==='/schedule'){
    await page.getByRole('button',{name:'원문 보기',exact:true}).click();await audit();
    await page.getByRole('button',{name:'한국어 해석',exact:true}).click();await audit();
   }
   if(route==='/readings'){
    await page.getByRole('button',{name:'전체 목차',exact:false}).click();await audit();
    await page.getByRole('dialog').locator('.toc-list li').nth(3).getByRole('button').click();await audit();
    await expect(page.locator('.source-bar-text')).toHaveText('―');
   }
   if(route==='/archive'){
    await page.locator(width===390?'.poster-thumbnail':'.poster-card-controls button:last-child').first().click();await audit();
   }
  }
 }
});
