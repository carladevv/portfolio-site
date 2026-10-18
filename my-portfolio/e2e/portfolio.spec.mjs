import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const published=JSON.parse(await readFile(new URL('../src/generated/projects.json',import.meta.url),'utf8'));

test('Navarra separates final gallery images from unused character experiments',async({page})=>{
  const project=published.find(p=>p.slug==='navarra-historical-sites');
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.setViewportSize({width:390,height:844});
  for(const lang of ['en','es']) {
    await page.goto(`/${lang}/projects/navarra-historical-sites/`);
    const hero=page.locator('figure img').first();
    await expect(hero).toHaveAttribute('src',project.media[0].image.src);
    await expect.poll(()=>hero.evaluate(img=>img.complete && img.naturalWidth>0)).toBe(true);
    await expect(page.locator('main a[href="https://navarra.arsoft-cloud.es/"]')).toBeVisible();
    await expect(page.locator('.project-prose img')).toHaveCount(4);
    for(const img of await page.locator('.project-prose img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(()=>img.evaluate(el=>el.complete && el.naturalWidth>0)).toBe(true);
      await expect(img).toHaveAttribute('src',/^\/media\//);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
  expect(errors).toEqual([]);
  await page.screenshot({path:'test-results/navarra-mobile.png',fullPage:true});
});

test('Desktop project navigation, direct URLs, media, language, and default theme',async({page,request})=>{
  const errors=[];const requests=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',req=>requests.push(req.url()));
  await page.goto('/en/');
  await expect(page.locator('main article')).toHaveCount(published.length);
  await expect(page.locator('main article').first().getByRole('heading',{level:2})).toHaveText('COVA BONICA VIRTUAL TOUR');
  await expect(page.getByRole('button',{name:'Change theme',exact:true})).toHaveCount(0);
  const cat=page.locator('.cat-lane img').first();
  await expect.poll(()=>cat.evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  const catSize=await cat.evaluate(img=>({width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height,ratio:img.naturalWidth/img.naturalHeight}));
  expect(catSize.height).toBe(32);
  expect(catSize.width/catSize.height).toBeCloseTo(catSize.ratio,1);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to content',exact:true})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('button',{name:'lg',exact:true}).click();
  await expect(page.locator('main')).toHaveCSS('font-size','18px');
  await page.getByRole('button',{name:'sm',exact:true}).click();
  await expect(page.locator('main')).toHaveCSS('font-size','14px');
  await page.getByRole('navigation').getByRole('link',{name:'Tooling',exact:true}).click();
  await expect(page).toHaveURL(/section=tooling/);
  await page.getByRole('heading',{name:'GLB Checker',exact:true}).getByRole('link').click();
  await expect(page).toHaveURL(/\/en\/projects\/glb-checker\/$/);
  await expect(page.getByRole('heading',{level:1,name:'GLB Checker'})).toBeVisible();
  await expect(page.locator('.project-prose strong')).toHaveText('After the project');
  await page.getByRole('link',{name:'Back to projects',exact:true}).click();
  await expect(page).toHaveURL(/section=tooling/);
  await page.getByRole('navigation').getByRole('link',{name:'All projects',exact:true}).click();
  const card=page.locator('main article').filter({has:page.getByRole('heading',{name:'ARCHIVARIUM',exact:true})});
  await card.getByRole('link',{name:'Read more: ARCHIVARIUM',exact:true}).click();
  await expect(page).toHaveURL(/\/en\/projects\/archivarium\/$/);
  await page.reload();
  await expect(page.getByRole('heading',{name:'ARCHIVARIUM',level:1})).toBeVisible();
  const hero=page.locator('figure img').first();
  await expect.poll(()=>hero.evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  expect(await hero.getAttribute('width')).toBeTruthy();
  expect(await hero.evaluate(img=>img.currentSrc)).toMatch(/\/media\/.*\.avif$/);
  await page.getByRole('button',{name:'Enlarge image',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Enlarge image',exact:true})).toBeFocused();
  await page.getByRole('button',{name:'ES',exact:true}).click();
  await expect(page).toHaveURL(/\/es\/projects\/archivarium\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang','es');
  await expect(page.getByRole('button',{name:'Cambiar tema',exact:true})).toHaveCount(0);
  await expect(page.locator('[data-theme]')).toHaveAttribute('data-theme','technoRose');
  await page.screenshot({path:'test-results/project-desktop.png',fullPage:true});
  expect((await request.get('/en/projects/no-such-project/')).status()).toBe(404);
  expect(errors).toEqual([]);
  expect(requests.filter(url=>/docs\.google\.com|postimg\.cc|img\.youtube\.com/.test(url))).toEqual([]);
});

test('Mobile collaborations, legacy category link, reduced motion, and image sizing',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/en/');
  const dropdown=page.getByRole('navigation').locator('details');
  await expect(dropdown.locator('summary')).toHaveText('All projects');
  await expect(dropdown.getByRole('link',{name:'Graphics',exact:true})).not.toBeVisible();
  await dropdown.locator('summary').click();
  await dropdown.getByRole('link',{name:'Archaeology',exact:true}).click();
  await expect(page.getByRole('heading',{level:1,name:'Archaeology',exact:true})).toBeVisible();
  await expect(dropdown).not.toHaveAttribute('open','');
  await dropdown.locator('summary').click();
  await page.keyboard.press('Escape');
  await expect(dropdown.locator('summary')).toBeFocused();
  await expect(dropdown).not.toHaveAttribute('open','');
  await page.goto('/en/?section=science');
  await expect(page.getByRole('heading',{level:1,name:'Science',exact:true})).toBeVisible();
  await page.goto('/#archaeology');
  await expect(page.getByRole('heading',{level:1,name:'Archaeology',exact:true})).toBeVisible();
  await expect(page.locator('main article').first().getByRole('heading',{level:2})).toHaveText('COVA BONICA VIRTUAL TOUR');
  await expect(page.locator('.cat-lane')).toBeHidden();
  await page.getByRole('navigation').getByRole('link',{name:'Collaborations',exact:true}).click();
  await expect(page.getByRole('heading',{level:1,name:'Collaborations',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'CALADONA',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Proyecto TUY',exact:true})).toBeVisible();
  await expect(page.locator('main article').first().getByRole('heading')).toHaveText('Grup de Recerca del Quaternari (GRQ–SERP)');
  await expect(page.getByRole('link',{name:'Visit website: Grup de Recerca del Quaternari (GRQ–SERP)',exact:true})).toHaveAttribute('href','https://grq.cat/');
  await expect(page.getByRole('link',{name:'Visit website: CALADONA',exact:true})).toHaveAttribute('href','https://visitavirtual.caladona.org/');
  await expect(page.getByRole('button',{name:'Coming soon',exact:true})).toBeDisabled();
  await expect(page.getByRole('link',{name:'get in touch',exact:true})).toHaveAttribute('href','https://www.linkedin.com/in/nadina-carla-cardillo-garreta');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
  await page.screenshot({path:'test-results/collaborations-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'ES',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Colaboraciones',level:1})).toBeVisible();
  await page.goto('/es/projects/sentence-stepper/');
  const img=page.locator('figure img').first();
  await expect.poll(()=>img.evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
  expect(await img.evaluate(i=>i.currentSrc)).toMatch(/\/(320|640)\.avif$/);
  await expect(page.getByRole('button',{name:/Reproducir/})).toBeVisible();
  await expect(page.locator('img[src$="animation.webp"]')).toHaveCount(0);
  await page.getByRole('button',{name:/Reproducir/}).click();
  await expect(page.locator('img[src$="animation.webp"]')).toHaveCount(1);
  await page.getByRole('button',{name:'Detener reproducción',exact:true}).click();
  await expect(page.locator('img[src$="animation.webp"]')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
  await page.screenshot({path:'test-results/project-mobile.png',fullPage:true});
  expect(errors).toEqual([]);
});

test('Direct English and Spanish project requests contain rendered descriptions without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  for(const lang of ['en','es']){
    await page.goto(`http://127.0.0.1:4173/${lang}/projects/navarra-historical-sites/`);
    await expect(page.locator('.project-prose h2').first()).toBeVisible();
    await expect(page.getByRole('heading',{level:1})).toContainText('Navarra');
    await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute('content',/Navarra/);
  }
  await context.close();
});
