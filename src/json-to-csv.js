const fs = require('fs');
const { JsonStreamStringify } = require('json-stream-stringify');
const { stringify } = require('csv-stringify');

// Path to the input JSON file and output CSV file
const inputFilePath = './data/input.json';
const outputFilePath = './data/output.csv';

// Function to set up the JSON to CSV transformation
function transformJSONtoCSV(inputFile, outputFile) {
  // Create a read stream for the JSON file
  const jsonReadStream = fs.createReadStream(inputFile, { encoding: 'utf8' });

  // Create a JSON parser stream using json-stream-stringify (called as a function, not a constructor)
  const jsonParserStream = new JsonStreamStringify();

  // Create a CSV stringifier with column headers
  const csvStream = stringify({
    header: true,
    columns: ['id', 'name', 'email', 'age'] // Define the CSV columns based on your JSON structure
  });

  // Create a write stream for the CSV file
  const csvWriteStream = fs.createWriteStream(outputFile);

  // Handle stream errors
  jsonReadStream.on('error', (err) => console.error('Error reading JSON file:', err));
  csvWriteStream.on('error', (err) => console.error('Error writing CSV file:', err));

  // Pipe the JSON stream into the CSV stringifier and then into the write stream
  jsonReadStream
    .pipe(jsonParserStream) // Convert JSON object into streamable chunks
    .pipe(csvStream)        // Convert JSON chunks to CSV format
    .pipe(csvWriteStream)   // Write CSV data to the output file
    .on('finish', () => console.log('JSON to CSV transformation complete!'));
}

// Run the transformation
transformJSONtoCSV(inputFilePath, outputFilePath);