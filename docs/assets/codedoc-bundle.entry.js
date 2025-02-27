import { getRenderer } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/transport/renderer.js';
import { initJssCs } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/transport/setup-jss.js';initJssCs();
import { installTheme } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/content/theme.ts';installTheme();
import { countCards } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/coding-blog-plugin/dist/es5/components/article-card/count-cards.js';countCards();
import { codeSelection } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/components/code/selection.js';codeSelection();
import { sameLineLengthInCodes } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/components/code/same-line-length.js';sameLineLengthInCodes();
import { initHintBox } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/components/code/line-hint/index.js';initHintBox();
import { initCodeLineRef } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/components/code/line-ref/index.js';initCodeLineRef();
import { initSmartCopy } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/components/code/smart-copy.js';initSmartCopy();
import { copyHeadings } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/components/heading/copy-headings.js';copyHeadings();
import { contentNavHighlight } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/components/page/contentnav/highlight.js';contentNavHighlight();
import { loadDeferredIFrames } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/transport/deferred-iframe.js';loadDeferredIFrames();
import { smoothLoading } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/transport/smooth-loading.js';smoothLoading();
import { tocHighlight } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/components/page/toc/toc-highlight.js';tocHighlight();
import { postNavSearch } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/components/page/toc/search/post-nav/index.js';postNavSearch();
import { copyLineLinks } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/components/code/line-links/copy-line-link.js';copyLineLinks();
import { gatherFootnotes } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/components/footnote/gather-footnotes.js';gatherFootnotes();
import { reloadOnChange } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/serve/reload.js';reloadOnChange();
import { ArticleCard } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/coding-blog-plugin/dist/es5/components/article-card/index.js';
import { DarkModeSwitch } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/components/darkmode/index.js';
import { ConfigTransport } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/core/dist/es6/transport/config.js';
import { Author } from '/Users/shubhendra.chauhan/Desktop/repo/guides/.codedoc/node_modules/@codedoc/coding-blog-plugin/dist/es5/components/author/index.js';

const components = {
  'xTzkv0RjpNF3MIAKJB60zA==': ArticleCard,
  'TjCuw4ZU0vcdq+3DoVa9zA==': DarkModeSwitch,
  'aCiYXsShHk4ZBdMxFKYPpA==': ConfigTransport,
  'FAYsDhgNKxSHiWNRwsgaVg==': Author
};

const renderer = getRenderer();
const ogtransport = window.__sdh_transport;
window.__sdh_transport = function(id, hash, props) {
  if (hash in components) {
    const target = document.getElementById(id);
    renderer.render(renderer.create(components[hash], props)).after(target);
    target.remove();
  }
  else if (ogtransport) ogtransport(id, hash, props);
}
