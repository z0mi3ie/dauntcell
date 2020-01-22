var validateQueryParametersMiddleware = function (req, res, next) {
    console.log('validateQueryParametersMiddleware called');

    let invalidParams = validateParams(req);
    if (invalidParams != null) {
        res.status(400).json(
            invalidParams
        );
        return;
    }
    next();
}

function getInvalidParams(req) {
    const validParams = ['name', 'type', 'description']
    let invalidFound = []
    console.log(req.query)
    console.log(Object.keys(req.query))
    Object.keys(req.query).forEach( elem => {
        //console.log(elem)
        if (!validParams.includes(elem)) {
            invalidFound.push(elem)
        }
    });
    return invalidFound;
}

function validateParams(req) {
    let invalidParams = getInvalidParams(req);
    if (invalidParams.length > 0) {
        return `Invalid query parameter(s) sent: [${invalidParams}]`;
    }
    return null;
}

module.exports = {
    validateQueryParametersMiddleware,
}