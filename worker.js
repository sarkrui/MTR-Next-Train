addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

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
    "OLY": "Olympic",
    "NAC": "Nam Cheong",
    "LAK": "Lai King",
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
    "MKK": "Mong Kok East",
    "KOT": "Kowloon Tong",
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
    "OCP": "Ocean Park",
    "WCH": "Wong Chuk Hang",
    "LET": "Lei Tung",
    "SOH": "South Horizons",
    "CEN": "Central",
    "TST": "Tsim Sha Tsui",
    "JOR": "Jordan",
    "YMT": "Yau Ma Tei",
    "MOK": "Mong Kok",
    "PRE": "Price Edward",
    "SSP": "Sham Shui Po",
    "CSW": "Cheung Sha Wan",
    "LCK": "Lai Chi Kok",
    "KWF": "Kwai Fong",
    "KWH": "Kwai Hing",
    "TWH": "Tai Wo Hau",
    "TSW": "Tsuen Wan",
};

async function handleRequest(request) {
    let url = new URL(request.url);
    let path = url.pathname.split('/');
    let line = path[1];
    let station = path[2];
    
    let base_url = "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php";

    let params = new URLSearchParams();
    params.append('line', line);
    params.append('sta', station);
    base_url += '?' + params.toString();

    try {
        const response = await fetch(base_url);
        const data = await response.json();
        const station_data = data.data[`${line}-${station}`];
        const curr_time = new Date(station_data.curr_time);

        const result = { "UP": [], "DOWN": [] };

        if (Array.isArray(station_data["UP"])) {
            for (let train of station_data["UP"]) {
                if (train["valid"] === "Y") {
                    const arrival_time = new Date(train['time']);
                    const time_diff = Math.round((arrival_time - curr_time) / 60000); // to get difference in minutes
                    const arrival_time_str = arrival_time.toTimeString().split(' ')[0].slice(0, 5); // to get time in 'HH:mm' format
                    result["UP"].push(`${stationCodeToName[train['dest']]} (${arrival_time_str}) in ${time_diff} mins`);
                }
            }
        }

        if (Array.isArray(station_data["DOWN"])) {
            for (let train of station_data["DOWN"]) {
                if (train["valid"] === "Y") {
                    const arrival_time = new Date(train['time']);
                    const time_diff = Math.round((arrival_time - curr_time) / 60000); // to get difference in minutes
                    const arrival_time_str = arrival_time.toTimeString().split(' ')[0].slice(0, 5); // to get time in 'HH:mm' format
                    result["DOWN"].push(`${stationCodeToName[train['dest']]} (${arrival_time_str}) in ${time_diff} mins`);
                }
            }
        }

        return new Response(JSON.stringify({
            line: lineCodeToName[line],
            station: stationCodeToName[station],
            schedule: result
        }), {status: 200, headers: {"content-type": "application/json;charset=UTF-8"}});
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.toString() }), {status: 500, headers: {"content-type": "application/json;charset=UTF-8"}});
    }
}