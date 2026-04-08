import requests
import polyline

OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving/"

def get_osrm_route(coordinates):
    """
    Fetches the route from OSRM for a given list of coordinates.
    coordinates: list of tuples/lists (lng, lat) -> (lon, lat)
    Returns a dictionary with distance, duration, and the geometry polyline.
    """
    # OSRM expects: {longitude},{latitude};{longitude},{latitude}...
    coords_str = ";".join([f"{lng},{lat}" for lng, lat in coordinates])
    url = f"{OSRM_BASE_URL}{coords_str}?overview=full"
    
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("code") == "Ok":
                route = data["routes"][0]
                return {
                    "distance_meters": route.get("distance", 0),
                    "duration_seconds": route.get("duration", 0),
                    "geometry": route.get("geometry", ""),
                    "waypoints": data.get("waypoints", [])
                }
    except Exception as e:
        print(f"Error connecting to OSRM: {e}")
    
    return None

def get_distance_matrix(coordinates):
    """
    Fetches the distance matrix between all points from OSRM.
    Returns an NxN matrix of distances and an NxN matrix of durations.
    """
    coords_str = ";".join([f"{lng},{lat}" for lng, lat in coordinates])
    url = f"https://router.project-osrm.org/table/v1/driving/{coords_str}?annotations=distance,duration"
    
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("code") == "Ok":
                return data.get("distances", []), data.get("durations", [])
    except Exception as e:
        print(f"Error fetching OSRM table: {e}")
    
    return None, None
