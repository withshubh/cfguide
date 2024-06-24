const path = require("path");
const fs = require("fs-extra");
const { generateScreenshot } = require("./screenshot");

const allMds = "docs/md";
const mdPath = path.resolve(process.cwd(), allMds);
const assetPath = path.resolve(process.cwd(), "assets/images/og-images");
let myMds = [];

function readMdFiles(directory) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      readMdFiles(filePath);
    } else if (file.endsWith(".md")) {
      myMds.push(filePath);
    }
  });
}

readMdFiles(mdPath);

myMds = myMds.filter((md) => !md.includes("_toc.md"));

for (let i = 0; i < myMds.length; i++) {
  const md = myMds[i];
  let content = fs.readFileSync(md, "utf8");

  const levelRegex = /^# (.*)$/m;
  const headingMatch = levelRegex.exec(content);
  const heading = headingMatch ? headingMatch[1].trim() : "Untitled Article";

  const description = content
    .split("\n")
    .find((line) => /^[a-zA-Z]/.test(line))
    .substring(0, 300);

  // Check if og:image meta tag is not present
  if (!content.includes(":MetaOverride property=og:image")) {
    const fileName = md.split("/md/")[1].replace(/\//g, "-").replace(".md", ".png");

    await generateScreenshot("https://guides.cashfree.com/og", path.join(assetPath, fileName), heading);

    const ogImage = `> :MetaOverride property=og:image\n>\n> https://guides.cashfree.com/assets/images/og-images/${fileName}\n\n`;
    content = ogImage + content;
  }

  // Check if og:description meta tag is not present
  if (!content.includes(":MetaOverride property=og:description")) {
    const ogDescription = `> :MetaOverride property=og:description\n>\n> ${description}\n\n`;
    content = ogDescription + content;
  }

  fs.writeFileSync(md, content);
}
