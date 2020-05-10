class Response {
    constructor() {
        this.succeeded = null;
        this.body = null;
        this.errorCode = null;
        this.message = null;
    }

    Succeeded(body) {
        this.succeeded = true;
        this.body = body;
        
        const result = {
            succeeded: this.succeeded,
            body: this.body
        }
        return result
    }

    Failed(errorCode, message) {
        this.succeeded = false;
        this.errorCode = errorCode;
        this.message = message;

        const result = {
            succeeded: this.succeeded,
            errorCode: this.errorCode,
            message: this.message
        }

        return result
    }
}

module.exports = Response