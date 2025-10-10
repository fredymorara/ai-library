import Papa from 'papaparse';

/**
 * Parses a CSV buffer and converts its rows into text chunks.
 * Each chunk will be a stringified JSON representation of a row.
 * @param {Buffer} fileBuffer - The raw buffer of the uploaded CSV file.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of text chunks.
 */
export function processCsvForChunks(fileBuffer) {
  return new Promise((resolve, reject) => {
    const csvString = fileBuffer.toString('utf-8');

    Papa.parse(csvString, {
      header: true, // Treat the first row as headers
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          console.error("CSV parsing errors:", results.errors);
          // Even with errors, we can try to return the data that was successfully parsed.
          if (results.data && results.data.length > 0) {
             const chunks = results.data.map(row => JSON.stringify(row));
             resolve(chunks);
          } else {
            reject(new Error('Failed to parse CSV file. No data extracted.'));
          }
        } else {
            const chunks = results.data.map(row => JSON.stringify(row));
            resolve(chunks);
        }
      },
      error: (error) => {
        console.error("CSV parsing failed:", error);
        reject(new Error('An error occurred during CSV parsing.'));
      }
    });
  });
}
