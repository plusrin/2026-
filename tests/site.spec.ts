import { test, expect } from '@playwright/test';
import manuscript from '../src/data/manuscript.json';

test('five menus, accurate event information, no horizontal overflow at 390px', async ({page})=>{
 const routes = [{href:'/',heading:'가장 먼 항해',label:'홈'},{href:'/schedule',heading:'오늘의 식순',label:'식순'},{href:'/readings',heading:'목소리를 따라',label:'원고'},{href:'/archive',heading:'이전 항해',label:'이전 항해'},{href:'/next',heading:'다음 항해',label:'다음 항해'}];
 await page.goto('/');
 await expect(page.getByRole('navigation').getByRole('link')).toHaveCount(5);
 await expect(page.getByRole('link',{name:'THE VOYAGE 홈'})).toBeVisible();
 const sea = await page.locator('.voyage-sea').boundingBox();
 const title = await page.getByRole('heading',{level:1}).boundingBox();
 expect(sea!.y + sea!.height).toBeLessThan(title!.y);
 await expect(page.getByText('2026년 11월 3일 화요일 저녁 7시',{exact:false})).toBeVisible();
 await expect(page.getByText('창원문성고등학교 2층 문성홀',{exact:false})).toBeVisible();
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
 await page.goto('/schedule');await page.getByRole('button',{name:'세이렌의 노래',exact:false}).click();
 await expect(page.getByText('영어 원문은 아직 제공되지 않았습니다.',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'한국어 해석',exact:true}).click();
 await expect(page.getByText('한국어 해석은 아직 제공되지 않았습니다.',{exact:false})).toBeVisible();
 await page.goto('/archive');const link=page.getByRole('link',{name:'심리테스트 체험하기',exact:false});
 await expect(link).toHaveAttribute('href','https://cognitive-error.vercel.app/');await expect(link).toHaveAttribute('rel','noopener noreferrer');
 await expect(page.locator('.empty-gallery')).toHaveCount(2);await expect(page.locator('.poster-card')).toHaveCount(0);
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
