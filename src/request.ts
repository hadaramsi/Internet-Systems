import { Request } from "express"

class request {
    body = {}
    userId = null
    query = null
    params = null
    constructor(body, userId, query, params) {
        this.body = body
        this.userId = userId
        this.query = query
        this.params = params
    }
    //cons
    static fromRestRequest(req: Request) {
        return new
            request(req.body, req.body.userId, req.query, req.params)
    }
}
export = request