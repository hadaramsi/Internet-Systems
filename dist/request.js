"use strict";
class request {
    constructor(body, userId, query, params) {
        this.body = {};
        this.userId = null;
        this.query = null;
        this.params = null;
        this.body = body;
        this.userId = userId;
        this.query = query;
        this.params = params;
    }
    //cons
    static fromRestRequest(req) {
        return new request(req.body, req.body.userId, req.query, req.params);
    }
}
module.exports = request;
//# sourceMappingURL=request.js.map