function getWIKIdata(searchTerm, totalResults) {
  // Set the default search term if none is provided
  var query = searchTerm || 'Nara';

  var numResult = totalResults && !isNaN(totalResults) ? parseInt(totalResults, 10) : 1;  // Default to 3 if not provided or not a number


  // Get the base URL from the external constructor
  var baseURL = myWIKIURL();

  if (!baseURL) {
    //Logger.log('WIKI_API_URL not found.');
    return null;
  }

  // Append the query parameters to the base URL, including origin=* to avoid CORS issues
  var url = baseURL + 'action=query&list=search&srsearch=' + encodeURIComponent(query) + '&format=json&utf8=1&origin=*';

  var output = []; // Initialize an array to store result objects

  try {
    var response = UrlFetchApp.fetch(url); // Fetch data from the Wikipedia API
    var data = JSON.parse(response.getContentText());

    // Log the entire response for debugging
    //Logger.log('API Response: ' + JSON.stringify(data));

    // Check if the query returned search results
    if (data.query && data.query.search && data.query.search.length > 0) {
      var searchResults = data.query.search;

      // Cap the results to 3
      var resultCount = Math.min(searchResults.length, numResult);

      for (var i = 0; i < resultCount; i++) {
        var result = searchResults[i];

        // Construct the Wikipedia page link using the pageid
        var resourceLink = 'https://en.wikipedia.org/?curid=' + result.pageid;
        var title = result.title || 'No title available';
        var snippet = result.snippet || 'No description available';
        var timestamp = result.timestamp || 'No timestamp available';

        // Add the result to the output array
        output.push({
          Title: title,
          Snippet: snippet,
          ResourceLink: resourceLink,
          LastUpdated: timestamp
        });
      }
    } else {
      //Logger.log('No search results found for the given query.');
    }
  } catch (e) {
    //Logger.log('Failed to fetch data: ' + e.toString()); // Log any errors that occur during the fetch process
  }

  Logger.log('Output: ' + JSON.stringify(output)); // Log the output array for debugging
  return output; // Return the array of result objects
}
