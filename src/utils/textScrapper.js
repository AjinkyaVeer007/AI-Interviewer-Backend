const { PDFParse } = require("pdf-parse");

async function textScrapper(path) {
  try {
    const parser = new PDFParse({ url: path });

    const result = await parser.getText();
    return result.text;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = textScrapper;
