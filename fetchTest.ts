import https from "https";

const url = "https://data.cdp.net/api/id/3d2f-dcbt.json?$where=country_area='United%20States%20of%20America'&$limit=1000&$offset=0";

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    try {
      const json = JSON.parse(data);
      console.log("Length:", json.length);
      if (json.length > 0) {
          console.log("First project:", json[0].project_title);
      }
    } catch (e) {
      console.log("Error parsing JSON:", e.message);
      console.log("Raw response (first 200 chars):", data.substring(0, 200));
    }
  });
}).on("error", (err) => {
  console.log("Error fetching:", err.message);
});
