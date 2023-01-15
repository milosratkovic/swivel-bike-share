from flask import Response, jsonify


class ResponseEncodable:
    """A base type for any object that can be encoded into a response"""

    def __init__(self) -> None:
        """Creates the ResponseEncodable class"""
        pass

    def encode_json() -> Response:
        """Encodes an object into JSON to be returned

        Returns:
            str: A JSON encoded string
        """
        return "{}"


class APIError:
    """A class containing all the data an API error should contain"""

    def __init__(self, error: str, message: str) -> None:
        self.error = error
        self.message = message

    def asdict(self):
        return {"error": self.error, "message": self.message}


class ResponseError(ResponseEncodable):
    """An error response returned by the API.

    Args:
        ResponseEncodable (_type_): Inherits the base class for encodable requests.
    """

    def __init__(self, errors: list[APIError], status: int) -> None:
        self.errors = errors
        self.status = status
        super().__init__()

    def encode_json(self) -> Response:
        return jsonify({"data": self.errors, "status": self.status})


class ResponseSuccess(ResponseEncodable):
    """A success response returned by the API.

    Args:
        ResponseEncodable (_type_): Inherits the base class for encodable requests.
    """

    def __init__(self, data: object) -> None:
        self.data = data
        super().__init__()

    def encode_json(self) -> Response:
        return jsonify({"data": self.data})
