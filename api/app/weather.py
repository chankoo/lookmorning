import requests

# with open("key.json", 'r') as fp:
#     API_KEY = json.load(fp)['key']
API_KEY = '60efa98fd883262c59309ae9e81183a4'

#99330b572f6a44fda61190bb729995b5 #weatherbit

def query_now(city, country):
    try:
        URL = 'http://api.openweathermap.org/data/2.5/weather?q={},{}&mode=json&units=metric&appid={}'
        res = requests.get(URL.format(city, country, API_KEY))
        data = res.json()
    except Exception as e:
        print(e)
        data = None
    finally:
        print("query_now res<{}>".format(res.status_code))
    return data


def query_5day(city, country):
    try:
        URL = 'https://api.openweathermap.org/data/2.5/forecast?q={},{}&appid={}' # &mode=json&units=metric
        res = requests.get(URL.format(city, country, API_KEY))
        print(res)
        data = res.json()
    except Exception as e:
        print(e)
        data = None
    finally:
        print("query_5day res<{}>".format(res.status_code))
    return data



if __name__ == '__main__':
    city = "London"
    country = "uk"

    query_now(city, country)
    query_5day(city, country)
