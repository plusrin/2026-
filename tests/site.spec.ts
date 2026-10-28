import { test, expect } from '@playwright/test';
import manuscript from '../src/data/manuscript.json';
import { readingDetails } from '../src/data/readingDetails';
import scenePosters from '../src/data/scenePosters.json';

test('five menus, accurate event information, no horizontal overflow at 390px', async ({page})=>{
 const routes = [{href:'/',heading:'가장 먼 항해',label:'홈'},{href:'/schedule',heading:'오늘의 식순',label:'식순'},{href:'/readings',heading:'목소리를 따라',label:'원고'},{href:'/archive',heading:'이전 항해',label:'이전 항해'},{href:'/next',heading:'다음 항해',label:'다음 항해'}];
 await page.goto('/');
 await expect(page.getByRole('navigation').getByRole('link')).toHaveCount(5);
 await expect(page.getByText('THE VOYAGE',{exact:true})).toHaveCount(0);
 await expect(page.getByRole('link',{name:'낭독 원고 만나기',exact:false})).toHaveCount(0);
 await expect(page.locator('.book-icon')).toHaveCount(0);
 await expect(page.locator('.book-panel h3')).toHaveText('《젊은 베르테르의 슬픔》');
 await expect(page.locator('.voyage-title')).toHaveText('가장 먼 항해');
 await expect(page.locator('.voyage-sea img')).toHaveAttribute('src','/images/home/main-voyage.jpg');
 const title=await page.locator('.voyage-title').boundingBox();
 const art=await page.locator('.voyage-sea').boundingBox();
 expect(title!.y).toBeLessThan(art!.y);
 const image=page.locator('.voyage-sea img');
 await expect(image).toHaveCSS('object-fit','contain');
 expect(await image.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);
 const tabs=page.getByRole('navigation');
 const rectangles=await tabs.getByRole('link').evaluateAll(links=>links.map(el=>{const r=el.getBoundingClientRect();return {top:r.top,left:r.left,right:r.right};}));
 expect(new Set(rectangles.map(r=>r.top)).size).toBe(1);
 expect(rectangles.every(r=>r.left>=0&&r.right<=390)).toBe(true);
 expect(await tabs.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
 await expect(page.getByText('2026년 11월 3일 화요일 저녁 7시',{exact:false})).toBeVisible();
 await expect(page.getByText('창원문성고등학교 2층 문성홀',{exact:false})).toBeVisible();
 await expect(page.getByText('2026년 창원문성고등학교 낭독회',{exact:true})).toHaveCount(1);
 await expect(page.locator('main .home-event')).toHaveCount(0);
 const details=await page.locator('.hero-event').boundingBox();
 const navBox=await tabs.boundingBox();
 const copy=await page.locator('.voyage-hero-copy').boundingBox();
 expect(copy!.y+copy!.height).toBeLessThan(art!.y);
 expect(details!.y).toBeGreaterThan(art!.y+art!.height*.68);
 expect(details!.y+details!.height).toBeLessThanOrEqual(navBox!.y);
 await expect(page.locator('.hero-event')).toContainText('나의 시선이 끝나는 곳에서,');
 for(const route of routes){
  await page.getByRole('navigation').getByRole('link',{name:route.label,exact:true}).click();
  await expect(page.getByRole('navigation').getByRole('link',{name:route.label,exact:true})).toHaveAttribute('aria-current','page');
  await expect(page).toHaveURL(new RegExp(route.href==='/'?'/$':route.href+'$'));
  await expect(page.getByRole('heading',{level:1})).toHaveText(route.heading);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 }
 await expect(page.getByText('현재 참여 학생',{exact:true})).toBeVisible();
 await expect(page.getByText('예상 최종 참여 학생',{exact:true})).toBeVisible();
});

test('all fifteen readings, contents dialog, boundaries, font controls and browser history',async({page})=>{
 await page.goto('/readings');
 await expect(page.getByRole('button',{name:'← 이전 낭독'})).toBeDisabled();
 for(let i=1;i<=15;i++){
  await expect(page.locator('.reader-count')).toHaveText(`${i} / 15`);
  const expected=manuscript.readings[i-1];
  const rendered=await page.locator('.reading-body [data-source-block]').allTextContents();
  expect(JSON.stringify(rendered)===JSON.stringify(expected.blocks.map(b=>b.text)),`Reading ${i}: all source blocks must match without rewriting`).toBe(true);
  await expect(page.locator('.missing-manuscript')).toHaveCount(0);
  await expect(page.locator('.reader-name')).toHaveText(`${readingDetails[i-1].className} ${expected.reader}`);
  await expect(page.getByText('학반 정보 미제공',{exact:true})).toHaveCount(0);
  expect(await page.locator('.reading-body').textContent()).not.toContain(readingDetails[i-1].summary);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(expected.date) await expect(page.locator('.letter-date')).toHaveText(expected.date);
  if(i===7) await expect(page.locator('.inline-letter-date')).toHaveText('10월 20일');
  if(i===8) await expect(page.locator('.inline-letter-date')).toHaveText('1772년 2월 17일');
  if(i===10) await expect(page.locator('.inline-letter-date')).toHaveText('9월 6일');
  await expect(page.locator('.reading-paper img,.reading-paper svg,.reading-paper canvas')).toHaveCount(0);
  if(i<15)await page.getByRole('button',{name:'다음 낭독 →'}).click();
 }
 await expect(page.getByRole('button',{name:'다음 낭독 →'})).toBeDisabled();
 await expect(page.locator('.speaker-heading').first()).toHaveText('김지후 낭독');
 await expect(page.locator('.narrator-heading')).toHaveText('[사회자]');
 await expect(page.locator('.narrator-heading')).toHaveCSS('border-top-width','1px');
 await expect(page.locator('.reading-paper')).toHaveCSS('background-color','rgb(244, 232, 211)');
 await expect(page.locator('.reading-paper')).toHaveCSS('background-image','none');
 await page.getByRole('button',{name:'전체 목차',exact:false}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('dialog').locator('ol li')).toHaveCount(15);
 await page.getByRole('dialog').getByRole('button',{name:'07 일곱 번째 낭독',exact:false}).click();
 await expect(page.locator('.reader-count')).toHaveText('7 / 15');
 await expect(page).toHaveURL(/reading=7/);
 await page.goBack(); await expect(page.locator('.reader-count')).toHaveText('15 / 15');
 await page.goForward(); await expect(page.locator('.reader-count')).toHaveText('7 / 15');
 await page.getByRole('button',{name:'글자 크게',exact:true}).click();
 await expect(page.locator('.reading-paper')).toHaveCSS('font-size','20px');
 await page.reload(); await expect(page.locator('.reader-count')).toHaveText('7 / 15');
 await page.getByRole('button',{name:'전체 목차',exact:false}).click();await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'전체 목차',exact:false})).toBeFocused();
});

test('siren languages and honest missing text, external test link and empty exhibitions',async({page})=>{
 await page.goto('/schedule');await page.getByRole('button',{name:'원문 보기',exact:true}).click();
 await expect(page.getByText('영어 원문은 아직 제공되지 않았습니다.',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'한국어 해석',exact:true}).click();
 await expect(page.getByText('한국어 해석은 아직 제공되지 않았습니다.',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'원문 닫기',exact:true}).click();
 await expect(page.locator('#siren-text')).toHaveCount(0);
 await expect(page.getByText('세부 진행 시간은 확정 후 안내합니다.',{exact:true})).toHaveCount(0);
 const readingLink=page.getByRole('link',{name:'낭독 원고 보기',exact:true});
 await expect(readingLink).toHaveAttribute('href','/readings');
 await readingLink.click(); await expect(page).toHaveURL(/\/readings$/);
 await page.goto('/archive');const link=page.getByRole('link',{name:'심리테스트 체험하기',exact:false});
 await expect(link).toHaveAttribute('href','https://cognitive-error.vercel.app/');await expect(link).toHaveAttribute('rel','noopener noreferrer');
 await expect(page.locator('.empty-gallery')).toHaveCount(1);await expect(page.locator('.scene-gallery .poster-card')).toHaveCount(5);
});

test('desktop layout stays within viewport',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 for(const url of ['/','/schedule','/readings','/archive','/next']){await page.goto(url);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.getByRole('navigation')).toBeVisible();}
});

test('poster fixture: front/back, image flip, zoom, original link, focus and Escape',async({page})=>{
 await page.goto('/gallery-test-fixture');
 const card=page.getByRole('button',{name:'테스트 실제 학생 아님',exact:false});await card.click();
 const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
 await expect(dialog.getByRole('button',{name:'앞면',exact:true})).toHaveAttribute('aria-pressed','true');
 const frontSrc=await dialog.locator('.poster-viewport img').getAttribute('src');
 await dialog.getByRole('button',{name:'앞면 이미지, 눌러서 뒤집기'}).click();
 await expect(dialog.getByRole('button',{name:'뒷면',exact:true})).toHaveAttribute('aria-pressed','true');
 const backSrc=await dialog.locator('.poster-viewport img').getAttribute('src');expect(backSrc).not.toBe(frontSrc);
 await expect(dialog.getByRole('link',{name:'원본 보기',exact:false})).toHaveAttribute('href',backSrc!);
 await dialog.getByRole('button',{name:'포스터 확대',exact:true}).click();await expect(dialog.locator('.zoom-controls')).toContainText('150%');
 await dialog.getByRole('button',{name:'포스터 축소',exact:true}).click();await expect(dialog.locator('.zoom-controls')).toContainText('100%');
 await dialog.getByRole('button',{name:'앞면',exact:true}).click();await expect(dialog.locator('.poster-viewport img')).toHaveAttribute('src',frontSrc!);
 await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(card).toBeFocused();
});

test('uncropped artwork and single-row sea tabs across mobile and tablet sizes', async ({page}) => {
 test.setTimeout(60000);
 for (const width of [320, 360, 390, 430, 768]) {
  await page.setViewportSize({width,height:844});
  for (const route of ['/', '/schedule', '/readings', '/archive', '/next']) {
   await page.goto(route);
   const nav=page.getByRole('navigation',{name:'주 메뉴'});
   await expect(nav.getByRole('link')).toHaveCount(5);
   await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
   const boxes=await nav.getByRole('link').evaluateAll(links=>links.map(el=>{const r=el.getBoundingClientRect();return {top:r.top,left:r.left,right:r.right,width:r.width};}));
   expect(new Set(boxes.map(r=>r.top)).size,`${width}px ${route}: tabs stay on one row`).toBe(1);
   expect(boxes.every(r=>r.left>=0&&r.right<=width&&r.width>=40)).toBe(true);
   expect(await nav.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px ${route}: page fits`).toBe(true);
   await expect(page.locator('.voyage-title')).toHaveText('가장 먼 항해');
   await expect(page.locator('main')).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
   await expect(page.locator('.voyage-sea img')).toHaveCSS('object-fit','contain');
   if(width<=430){
    const actualRatio=await page.locator('.voyage-sea img').evaluate((el:HTMLImageElement)=>el.getBoundingClientRect().width/el.getBoundingClientRect().height);
    expect(Math.abs(actualRatio-1374/1145)).toBeLessThan(.01);
   }
  }
 }
});

test('generated sky and water paintings load without tiling and leave reading paper plain', async ({page}) => {
 await page.goto('/readings');
 const sky=await page.locator('.voyage-hero').evaluate(el=>getComputedStyle(el,'::before').backgroundImage);
 expect(sky).toContain('/images/backgrounds/voyage-sky-extension.webp');
 const ocean=page.locator('.landscape-ocean');
 await expect(ocean).toHaveCSS('position','fixed');
 expect(await ocean.evaluate(el=>getComputedStyle(el).backgroundImage)).toContain('/images/backgrounds/voyage-ocean-extension.webp');
 await expect(ocean).toHaveCSS('background-repeat','no-repeat, no-repeat');
 for(const file of ['/images/backgrounds/voyage-sky-extension.webp','/images/backgrounds/voyage-ocean-extension.webp']){
  const loaded=await page.evaluate(async src=>{const image=new Image();image.src=src;await image.decode();return image.naturalWidth>0&&image.naturalHeight>0;},file);
  expect(loaded).toBe(true);
 }
 await expect(page.locator('.reading-paper')).toHaveCSS('background-color','rgb(244, 232, 211)');
 await expect(page.locator('.reading-paper')).toHaveCSS('background-image','none');
 await expect(page.locator('.reading-paper img,.reading-paper svg')).toHaveCount(0);
});

test('all contents entries retain source dates and show summary then class and name',async({page})=>{
 await page.goto('/readings');await page.getByRole('button',{name:'전체 목차',exact:false}).click();
 const dialog=page.getByRole('dialog');const items=dialog.locator('.toc-list li');
 await expect(items).toHaveCount(15);
 const expectedClasses=['1학년 4반','1학년 4반','1학년 2반','1학년 1반','1학년 2반','1학년 1반','1학년 2반','1학년 4반','1학년 4반','1학년 1반','1학년 4반','1학년 1반','1학년 4반','1학년 2반','1학년 1반'];
 for(let i=0;i<15;i++){
  const row=items.nth(i);
  await expect(row.locator('.toc-summary')).toHaveText(readingDetails[i].summary);
  await expect(row.locator('.toc-student')).toHaveText(`${expectedClasses[i]} ${manuscript.readings[i].reader}`);
  if(manuscript.readings[i].date)await expect(row.locator('.toc-date')).toHaveText(manuscript.readings[i].date!);
  else await expect(row.locator('.toc-date')).toHaveCount(0);
 }
 await items.nth(14).getByRole('button').click();
 await expect(page.locator('.reader-count')).toHaveText('15 / 15');
 await expect(page.locator('.reader-name')).toHaveText('1학년 1반 김지후');
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  await page.getByRole('button',{name:'전체 목차',exact:false}).click();
  expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  await page.keyboard.press('Escape');
 }
});

test('exact uploaded book cover loads uncropped at mobile and desktop sizes',async({page})=>{
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});await page.goto('/');
  const cover=page.getByRole('img',{name:'《젊은 베르테르의 슬픔》 책 표지',exact:true});
  await expect(cover).toHaveAttribute('src','/images/home/werther-cover.jpg');
  await expect(cover).toHaveCSS('object-fit','contain');
  const dimensions=await cover.evaluate(async(el:HTMLImageElement)=>{await el.decode();const box=el.getBoundingClientRect();return {naturalWidth:el.naturalWidth,naturalHeight:el.naturalHeight,width:box.width,height:box.height};});
  expect(dimensions.naturalWidth).toBe(372);expect(dimensions.naturalHeight).toBe(541);
  expect(Math.abs(dimensions.width/dimensions.height-372/541)).toBeLessThan(.01);
  expect(dimensions.width).toBe(width===390?90:108);
  expect(await page.locator('.book-panel').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  await expect(page.locator('.book-panel h3')).toHaveText('《젊은 베르테르의 슬픔》');
  await expect(page.locator('.book-icon')).toHaveCount(0);
 }
});

test('five real scene posters: correct pairs, independent touch flips and both-side enlargement',async({page})=>{
 test.setTimeout(90000);
 await page.goto('/archive');
 const cards=page.locator('.scene-gallery .poster-card');await expect(cards).toHaveCount(5);
 for(let i=0;i<5;i++){
  const card=cards.nth(i),poster=scenePosters[i];
  await expect(card.locator('h3')).toHaveText(poster.title);await expect(card.locator('.poster-owner')).toHaveText(poster.student);
  await expect(card.locator('img')).toHaveAttribute('src',poster.front);
  await card.getByRole('button',{name:'뒷면 보기',exact:true}).click();await expect(card.locator('img')).toHaveAttribute('src',poster.back);
  for(let j=0;j<5;j++)if(i!==j)await expect(cards.nth(j).locator('img')).toHaveAttribute('src',scenePosters[j].front);
  await card.getByRole('button',{name:/뒷면 확대 보기$/}).click();
  const dialog=page.getByRole('dialog');await expect(dialog.locator('.poster-viewport img')).toHaveAttribute('src',poster.back);
  await expect(dialog.getByRole('link',{name:'원본 보기',exact:false})).toHaveAttribute('href',poster.back);
  await dialog.getByRole('button',{name:'앞면',exact:true}).click();await expect(dialog.locator('.poster-viewport img')).toHaveAttribute('src',poster.front);
  await expect(dialog.getByRole('link',{name:'원본 보기',exact:false})).toHaveAttribute('href',poster.front);
  await dialog.getByRole('button',{name:'포스터 확대',exact:true}).click();await expect(dialog.locator('.zoom-controls')).toContainText('150%');
  await page.keyboard.press('Escape');await expect(card.locator('img')).toHaveAttribute('src',poster.front);
  await card.locator('.poster-flip').click();await expect(card.locator('img')).toHaveAttribute('src',poster.back);
  await card.locator('.poster-flip').click();await expect(card.locator('img')).toHaveAttribute('src',poster.front);
 }
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  expect(await page.locator('.scene-gallery').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(width===390?1:2);
  for(let i=0;i<5;i++){
   const card=cards.nth(i);await card.scrollIntoViewIfNeeded();
   for(const side of ['front','back'] as const){
    if(side==='back')await card.getByRole('button',{name:'뒷면 보기',exact:true}).click();
    const size=await card.locator('img').evaluate(async(el:HTMLImageElement)=>{await el.decode();const r=el.getBoundingClientRect();return {width:r.width,height:r.height,naturalWidth:el.naturalWidth,naturalHeight:el.naturalHeight};});
    expect(Math.abs(size.width/size.height-size.naturalWidth/size.naturalHeight)).toBeLessThan(.01);
    await expect(card.locator('img')).toHaveCSS('object-fit','contain');
   }
   await card.getByRole('button',{name:'앞면 보기',exact:true}).click();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await expect(page.locator('.gallery-section').nth(1).locator('.empty-gallery')).toHaveCount(1);
});
