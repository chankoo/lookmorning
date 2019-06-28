import json

def serializer(l):
    ret = []
    for row in l:
        ret.append(json.loads(row.serialize()))
    return json.dumps(ret)

def dictionalizer(l):
    ret = []
    for row in l:
        ret.append(json.loads(row.serialize()))
    return ret


def is_person(img_path):
    from gluoncv import data, utils
    import pickle

    with open('../static/faster_rcnn_resnet50_v1b_voc.pkl', 'rb') as fp:
        net = pickle.load(fp)

    im_fname = utils.download(img_path)
    x, orig_img = data.transforms.presets.rcnn.load_test(im_fname)
    box_ids, scores, bboxes = net(x)  # box_id 14 is 'person'

    # iterate for images
    labels = box_ids[0].asnumpy()
    scores = scores[0].asnumpy()

    for i, bbox in enumerate(bboxes):
        if labels is not None and labels.flat[i] != 14:
            continue
        if scores is not None and scores.flat[i] < 0.7:  # Let thresh = 0.7
            continue
        return True

    # delete
    return False