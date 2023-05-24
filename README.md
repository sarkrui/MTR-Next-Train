# MTR Schedule API

This is a Node.js application that provides an API to retrieve MTR (Mass Transit Railway) train schedules for a specific line and station in Hong Kong. The API fetches real-time data from the Hong Kong Open Data platform.


## Demo
1. Open your web browser and navigate to the following [URL](https://mtr.idata.host/EAL/HUH):
  ```ruby
  https://mtr.idata.host/EAL/HUH
  ```
  Replace EAL with the [code](https://github.com/sarkrui/MTR-Next-Train/MTR-Codenames.md) of the desired MTR line (e.g., AEL for Airport Express) and HUH with the code of the desired MTR station (e.g., HUH for Hung Hom). The API will return a JSON response containing the train schedule for the specified line and station.

2. iOS Shortcut Integration
  - Download [iOS Shortcut Example](https://www.icloud.com/shortcuts/76c807ea99474bd39de359c29d8cf8e8)
  - Open the Shortcuts app and import the downloaded shortcut.
  - Configure the shortcut by providing the desired line and station codes.
  - Run the shortcut to retrieve the train schedule.

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
  "line": "East Rail Line",
  "station": "Hung Hom",
  "schedule": {
    "UP": [
      "Lok Ma Chau (15:57) in 1 mins",
      "Lo Wu (16:02) in 6 mins",
      "Lo Wu (16:06) in 10 mins",
      "Lok Ma Chau (16:10) in 14 mins"
    ],
    "DOWN": [
      "Admiralty (15:58) in 2 mins",
      "Admiralty (16:01) in 5 mins",
      "Admiralty (16:05) in 9 mins",
      "Admiralty (16:09) in 13 mins"
    ]
  }
}
```

  - line: The name of the MTR line.
  - station: The name of the MTR station.
  - schedule: An object containing train schedules for both the "UP" and "DOWN" directions.
  - UP: An array of strings representing upcoming train arrivals in the "UP" direction.
  - DOWN: An array of strings representing upcoming train arrivals in the "DOWN" direction.