const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'content/puzzles');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const filePath = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (data.answerNormalized && !data.answersNormalized) {
    data.answersNormalized = [data.answerNormalized];
    delete data.answerNormalized;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
}
console.log('Done');
