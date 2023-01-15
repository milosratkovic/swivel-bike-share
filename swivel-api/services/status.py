from flask import Blueprint
from requests import ResponseSuccess

StatusService = Blueprint("status_service", __name__)


@StatusService.route("/ping", methods=["GET"])
def hello():
    resp = ResponseSuccess({"message": "pong"})
    return resp.encode_json()
