import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./e2e', timeout:45000, workers:1,
  use:{baseURL:'http://127.0.0.1:4173',channel:'msedge',headless:true,viewport:{width:1440,height:1000},screenshot:'only-on-failure',trace:'retain-on-failure'},
  webServer:{command:'node scripts/preview.mjs',url:'http://127.0.0.1:4173',reuseExistingServer:true},
});
