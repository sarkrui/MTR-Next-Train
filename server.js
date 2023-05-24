const express = require('express');
const axios = require('axios');
const moment = require('moment');

const app = express();
const port = 3200;

const lineCodeToName = {
    "AEL": "Airport Express",
    "TCL": "Tung Chung Line",
    "TML": "Tuen Ma Line",
    "TKL": "Tseung Kwan O Line",
    "EAL": "East Rail Line",
    "SIL": "South Island Line",
    "TWL": "Tsuen Wan Line",
};

const stationCodeToName = {
    "HOK": "Hong Kong",
    "KOW": "Kowloon",
    "TSY": "Tsing Yi",
    "AIR": "Airport",
    "AWE": "AsiaWorld Expo",
    "HOK": "Hong Kong",
    "KOW": "Kowloon",
    "OLY": "Olympic",
    "NAC": "Nam Cheong",
    "LAK": "Lai King",
    "TSY": "Tsing Yi",
    "SUN": "Sunny Bay",
    "TUC": "Tung Chung",
    "WKS": "Wu Kai Sha",
    "MOS": "Ma On Shan",
    "HEO": "Heng On",
    "TSH": "Tai Shui Hang",
    "SHM": "Shek Mun",
    "CIO": "City One",
    "STW": "Sha Tin Wai",
    "CKT": "Che Kung Temple",
    "TAW": "Tai Wai",
    "HIK": "Hin Keng",
    "DIH": "Diamond Hill",
    "KAT": "Kai Tak",
    "SUW": "Sung Wong Toi",
    "TKW": "To Kwa Wan",
    "HOM": "Ho Man Tin",
    "HUH": "Hung Hom",
    "ETS": "East Tsim Sha Tsui",
    "AUS": "Austin",
    "NAC": "Nam Cheong",
    "MEF": "Mei Foo",
    "TWW": "Tsuen Wan West",
    "KSR": "Kam Sheung Road",
    "YUL": "Yuen Long",
    "LOP": "Long Ping",
    "TIS": "Tin Shui Wai",
    "SIH": "Siu Hong",
    "TUM": "Tuen Mun",
    "NOP": "North Point",
    "QUB": "Quarry Bay",
    "YAT": "Yau Tong",
    "TIK": "Tiu Keng Leng",
    "TKO": "Tseung Kwan O",
    "LHP": "LOHAS Park",
    "HAH": "Hang Hau",
    "POA": "Po Lam",
    "ADM": "Admiralty",
    "EXC": "Exhibition Centre",
    "HUH": "Hung Hom",
    "MKK": "Mong Kok East",
    "KOT": "Kowloon Tong",
    "TAW": "Tai Wai",
    "SHT": "Sha Tin",
    "FOT": "Fo Tan",
    "RAC": "Racecourse",
    "UNI": "University",
    "TAP": "Tai Po Market",
    "TWO": "Tai Wo",
    "FAN": "Fanling",
    "SHS": "Sheung Shui",
    "LOW": "Lo Wu",
    "LMC": "Lok Ma Chau",
    "ADM": "Admiralty",
    "OCP": "Ocean Park",
    "WCH": "Wong Chuk Hang",
    "LET": "Lei Tung",
    "SOH": "South Horizons",
    "CEN": "Central",
    "ADM": "Admiralty",
    "TST": "Tsim Sha Tsui",
    "JOR": "Jordan",
    "YMT": "Yau Ma Tei",
    "MOK": "Mong Kok",
    "PRE": "Price Edward",
    "SSP": "Sham Shui Po",
    "CSW": "Cheung Sha Wan",
    "LCK": "Lai Chi Kok",
    "MEF": "Mei Foo",
    "LAK": "Lai King",
    "KWF": "Kwai Fong",
    "KWH": "Kwai Hing",
    "TWH": "Tai Wo Hau",
    "TSW": "Tsuen Wan",
};

app.get('/api/v1/:line/:station', async (req, res) => {
    const station = req.params.station;
    const line = req.params.line;
    const base_url = "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php";

    const params = {
        line: line,
        sta: station,
    };

    try {
        const response = await axios.get(base_url, { params });

        const data = response.data;
        const station_data = data.data[`${line}-${station}`];
        const curr_time = moment(station_data.curr_time, 'YYYY-MM-DD HH:mm:ss');

        const result = { "UP": [], "DOWN": [] };

        if (Array.isArray(station_data["UP"])) {
            for (let train of station_data["UP"]) {
                if (train["valid"] === "Y") {
                    const arrival_time = moment(train['time'], 'YYYY-MM-DD HH:mm:ss');
                    const time_diff = arrival_time.diff(curr_time, 'minutes');
                    const arrival_time_str = arrival_time.format('HH:mm');
                    result["UP"].push(`${stationCodeToName[train['dest']]} (${arrival_time_str}) in ${time_diff} mins`);
                }
            }
        }

        if (Array.isArray(station_data["DOWN"])) {
            for (let train of station_data["DOWN"]) {
                if (train["valid"] === "Y") {
                    const arrival_time = moment(train['time'], 'YYYY-MM-DD HH:mm:ss');
                    const time_diff = arrival_time.diff(curr_time, 'minutes');
                    const arrival_time_str = arrival_time.format('HH:mm');
                    result["DOWN"].push(`${stationCodeToName[train['dest']]} (${arrival_time_str}) in ${time_diff} mins`);
                }
            }
        }

        res.status(200).json({line: lineCodeToName[line], station: stationCodeToName[station], schedule: result});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.toString() });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});