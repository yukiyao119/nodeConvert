async function getWIKIdata(searchTerm = 'Nara', totalResults = 3) {
  const numResult = !isNaN(totalResults) ? parseInt(totalResults, 10) : 3;
  const baseURL = 'https://en.wikipedia.org/w/api.php?';
  const url = `${baseURL}action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&utf8=1&origin=*`;

  let output = [];

  try {
    const response = await fetch(url); // Native fetch
    const data = await response.json();

    if (data.query?.search?.length) {
      output = data.query.search.slice(0, numResult).map(result => ({
        title: result.title || 'No title available',
        snippet: result.snippet || 'No description available',
        resourceLink: `https://en.wikipedia.org/?curid=${result.pageid}`,
        lastUpdated: result.timestamp || 'No timestamp available'
      }));
    } else {
      output.push({ message: 'No search results found.' });
    }
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    output.push({ error: 'Failed to fetch data.' });
  }

  console.log('Output:', JSON.stringify(output, null, 2));
  return output;
}

getWIKIdata('Shanghai', 2)
  .then(() => console.log('✅ Done fetching data'))
  .catch(err => console.error('❌ Error:', err));
