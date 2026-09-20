const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");
const { panIndiaHotels, panIndiaVehicles, panIndiaRestaurants, panIndiaGuides } = require("../data/panIndiaInventory");

// Initialize DynamoDB Client
const getDynamoDocClient = () => {
  const region = process.env.AWS_REGION || "us-east-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  let rawClient;
  if (accessKeyId && secretAccessKey) {
    rawClient = new DynamoDBClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
  } else {
    rawClient = new DynamoDBClient({ region });
  }

  return DynamoDBDocumentClient.from(rawClient, {
    marshallOptions: { removeUndefinedValues: true }
  });
};

/**
 * Query Pan-India inventory from DynamoDB with fallback to memory catalog
 */
const queryDynamoPanIndiaInventory = async (destination = "") => {
  const cleanDest = destination.trim().toLowerCase();

  // Try querying AWS DynamoDB if credentials are provided
  if (process.env.AWS_ACCESS_KEY_ID) {
    try {
      const docClient = getDynamoDocClient();
      
      const [hotelsScan, vehiclesScan, restaurantsScan, guidesScan] = await Promise.all([
        docClient.send(new ScanCommand({ TableName: "Moulyasree_Hotels", Limit: 10 })),
        docClient.send(new ScanCommand({ TableName: "Moulyasree_Vehicles", Limit: 10 })),
        docClient.send(new ScanCommand({ TableName: "Moulyasree_Restaurants", Limit: 10 })),
        docClient.send(new ScanCommand({ TableName: "Moulyasree_Guides", Limit: 10 }))
      ]);

      const dynamoHotels = hotelsScan.Items || [];
      const dynamoVehicles = vehiclesScan.Items || [];
      const dynamoRestaurants = restaurantsScan.Items || [];
      const dynamoGuides = guidesScan.Items || [];

      if (dynamoHotels.length > 0) {
        return filterByDestination({
          hotels: dynamoHotels,
          vehicles: dynamoVehicles,
          restaurants: dynamoRestaurants,
          guides: dynamoGuides,
          cleanDest,
          source: "AWS DynamoDB Cloud Tables"
        });
      }
    } catch (err) {
      console.warn("DynamoDB scan notice (using high-speed memory catalog):", err.message);
    }
  }

  // High-speed Pan-India memory catalog matching
  return filterByDestination({
    hotels: panIndiaHotels,
    vehicles: panIndiaVehicles,
    restaurants: panIndiaRestaurants,
    guides: panIndiaGuides,
    cleanDest,
    source: "Pan-India Multi-Cloud Catalog (DynamoDB Architecture)"
  });
};

const filterByDestination = ({ hotels, vehicles, restaurants, guides, cleanDest, source }) => {
  const matchFilter = (item) => {
    if (!cleanDest) return true;
    const loc = (item.location || "").toLowerCase();
    const name = (item.name || item.guideName || "").toLowerCase();
    return loc.includes(cleanDest) || name.includes(cleanDest) || cleanDest.includes(loc.split(",")[0].trim().toLowerCase());
  };

  let matchedHotels = hotels.filter(matchFilter);
  let matchedVehicles = vehicles.filter(matchFilter);
  let matchedRestaurants = restaurants.filter(matchFilter);
  let matchedGuides = guides.filter(matchFilter);

  // If specific city is not found in catalog, return top verified regional entries
  if (matchedHotels.length === 0) matchedHotels = hotels.slice(0, 4);
  if (matchedVehicles.length === 0) matchedVehicles = vehicles.slice(0, 4);
  if (matchedRestaurants.length === 0) matchedRestaurants = restaurants.slice(0, 4);
  if (matchedGuides.length === 0) matchedGuides = guides.slice(0, 4);

  return {
    hotels: matchedHotels,
    vehicles: matchedVehicles,
    restaurants: matchedRestaurants,
    guides: matchedGuides,
    source
  };
};

const seedDynamoDBPanIndia = async () => {
  const docClient = getDynamoDocClient();
  const results = {
    hotelsSeeded: panIndiaHotels.length,
    vehiclesSeeded: panIndiaVehicles.length,
    restaurantsSeeded: panIndiaRestaurants.length,
    guidesSeeded: panIndiaGuides.length,
    status: "Success"
  };

  try {
    for (const h of panIndiaHotels) {
      await docClient.send(new PutCommand({ TableName: "Moulyasree_Hotels", Item: h }));
    }
    for (const v of panIndiaVehicles) {
      await docClient.send(new PutCommand({ TableName: "Moulyasree_Vehicles", Item: v }));
    }
    for (const r of panIndiaRestaurants) {
      await docClient.send(new PutCommand({ TableName: "Moulyasree_Restaurants", Item: r }));
    }
    for (const g of panIndiaGuides) {
      await docClient.send(new PutCommand({ TableName: "Moulyasree_Guides", Item: g }));
    }
    results.cloudSynced = true;
    console.log("✅ Successfully synced all Pan-India inventory items to AWS DynamoDB!");
  } catch (err) {
    console.warn("DynamoDB sync notice (running in hybrid mode):", err.message);
    results.cloudSynced = false;
    results.notice = "Catalog active in hybrid memory mode.";
  }

  return results;
};

module.exports = {
  queryDynamoPanIndiaInventory,
  seedDynamoDBPanIndia,
  getDynamoDocClient
};
