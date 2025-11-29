import { useEffect, useState } from "react";
import axios from "axios";

// api endpoint
// query
// fildes you want
// limit

export default function useRouteSearch(
  url, // hit this
  fields = [], // result contains this 
  limit = 10 // this mucht
) {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");



  useEffect(() => {
  if (!query.trim()) {
    setResult([]); // Clear results if query is empty
    return;
  }

  const fetchData = async () => {
    try {
      setLoading(true); // Start loading indicator
      const params = {
        q: query,
        fields: JSON.stringify(fields),
        limit,
      };

      const response = await axios.get(url, { params });
      setResult(response.data); // Set result data on successful response
    } catch (err) {
      console.error('Search error:', err); // Handle any errors
      setResult([]);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  fetchData(); // Call the async function

}, [query, fields, limit, url]); 
  
  return [result.routes, setQuery, loading];
}
