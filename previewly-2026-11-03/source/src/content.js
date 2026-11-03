/* the featured prototype: every name, number and date the story shows, in one place. Northvale is illustrative (a
   fictional bank); its screens are in src/mockups. index.html repeats a few of these in markup, marked "content.js" */
export var SITE = {
  url: 'previewly.cc/northvale',       // the link, as the bar shows it; Copy link copies it with https://
  zip: 'northvale.zip',                // what the pouch uploads
  // the six file tiles, left to right on plate 02. The cobalt tile carries the entry page
  files: ['statement.pdf', 'styles.css', 'app.js', 'index.html', 'dashboard.html', 'assets/'],
  entry: 'index.html',
  fileCount: 38,                       // files checked in chapter 2
  versions: { 1: '12 Oct', 2: '19 Oct', 3: 'Today' },   // the version panes and the switcher in chapter 5
  latest: 'updated just now',          // how the bar describes v3
  passcode: '2026'                     // the keypad's demo code in chapter 4
};
