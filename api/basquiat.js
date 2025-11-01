import fs from "fs";
import path from "path";

export const handler = async (event, context) => {
  try {
    const filePath = path.resolve("./data.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(jsonData);

    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "max-age=0, s-maxage=1800",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers":
          "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error reading data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to read basquiat.json" }),
    };
  }
};
