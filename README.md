# MTR Schedule API

This is a Node.js application that provides an API to retrieve MTR (Mass Transit Railway) train schedules for a specific line and station in Hong Kong. The API fetches real-time data from the Hong Kong Open Data platform.

## Prerequisites

- Node.js (version 12 or above)
- NPM (Node Package Manager)

## Installation

1. Clone the repository or download the code files.
2. Open a terminal and navigate to the project directory.
3. Install the dependencies by running the following command:

   ```bash
   npm install
   ```
## Usage
1. Start the server by running the following command:
   ```bash
   npm start
   ```
   The server will start running on http://localhost:3200.

2. Access the API using the following endpoint:
   ```ruby
   GET /api/v1/:line/:station
   ```
   - Replace :line with the code of the desired MTR line (e.g., AEL for Airport Express).
   - Replace :station with the code of the desired MTR station (e.g., HOK for Hong Kong).

The API will return a JSON response containing the train schedule for the specified line and station.

## API Response

```json
{
    "line": "Line Name",
    "station": "Station Name",
    "schedule": {
        "UP": ["Train to Destination will arrive at Time in Minutes mins"],
        "DOWN": ["Train to Destination will arrive at Time in Minutes mins"]
        }
    }
```

  - line: The name of the MTR line.
  - station: The name of the MTR station.
  - schedule: An object containing train schedules for both the "UP" and "DOWN" directions.
  - UP: An array of strings representing upcoming train arrivals in the "UP" direction.
  - DOWN: An array of strings representing upcoming train arrivals in the "DOWN" direction.