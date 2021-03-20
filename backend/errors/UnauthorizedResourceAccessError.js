class UnauthorizedResourceAccessError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.status = 401;
    }
}

module.exports = UnauthorizedResourceAccessError;