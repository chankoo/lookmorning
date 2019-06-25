if __name__ == '__main__':
    import os
    import json
    import requests

    ###
    direc = 'dailylook'
    os.chdir('./static')
    ###


    with open('dailylook.json', 'r') as fp:
        metas = json.load(fp)['GraphImages']

    headers = {'Content-Type': 'application/json; charset=utf-8'}
    url = 'http://0.0.0.0:8080/daily'

    for meta in metas:
        loc = ''
        if meta['location'] is not None:
            loc = meta['location']['id']

        post = json.dumps({
            "city": "Seoul",
            "timestamp": meta['taken_at_timestamp'],
            "img_path":'https://project-lookmorning.s3.ap-northeast-2.amazonaws.com/{}/{}_{}_{}.jpg'
                .format(direc, meta['shortcode'], meta['taken_at_timestamp'], loc),
            "satis": None,
        })


        res = requests.post(url, headers=headers, data=post)
        if res.status_code >200:
            print(res.status_code)


