from flask import Flask, jsonify
import requests
from datetime import datetime, timedelta

app = Flask(__name__)

def fetch_start_time(Station_line_code, Station_name):
    url = f"https://mtr.idata.host/{Station_line_code}/{Station_name}"
    response = requests.get(url)
    data = response.json()
    for schedule in data["schedule"]["UP"]:
        if "Lok Ma Chau" in schedule:
            start_time = schedule.split(" ")[3].replace(")", "").replace("(","")
            return start_time
    return None

def generate_schedule(start_time, interval, duration):
    start = datetime.strptime(start_time, "%H:%M")
    end = start + timedelta(hours=duration)
    time = start

    schedule = []

    while time <= end:
        schedule.append(time.strftime("%H:%M"))
        time += timedelta(minutes=interval)

    return schedule

@app.route('/<Station_line_code>/<Station_name>')
def get_schedule(Station_line_code, Station_name):
    start_time = fetch_start_time(Station_line_code, Station_name)

    if start_time is not None:
        interval = 12
        duration = 2
        schedule = generate_schedule(start_time, interval, duration)
        return jsonify(schedule)
    else:
        return jsonify({"error": "Could not fetch start time"}), 400

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)