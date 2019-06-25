
if __name__ == '__main__':
    import pandas as pd
    import json
    import requests


    data = pd.read_csv('temp_weatherCluster.csv')
    headers = {'Content-Type':'application/json; charset=utf-8'}
    url = 'http://0.0.0.0:8080/weather/past'

    for i in range(len(data)):
        post = json.dumps({
                "city": "Seoul",
                "datetime": data.datetime.at[i],
                "cluster": str(data.cluster.at[i]),
                "is_rain": str(data.is_rain.at[i])
                })
        # print(post)
        res = requests.post(url, headers=headers, data=post)
        # print(res)

