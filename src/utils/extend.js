const extend = (...args) => {
    var extended = {};
    for(let key in args) {
        var argument = args[key];
        for (let prop in argument) {
            if (Object.prototype.hasOwnProperty.call(argument, prop)) {
                extended[prop] = argument[prop];
            }
        }
    }
    return extended;
};

export default extend;