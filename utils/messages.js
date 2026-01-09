const moment = require('moment'); //to generate the time stamp

function formatMessage(username, text) {

    return {
        username,
        text,
        time: moment().format('h:mm a')
    }

}

module.exports = formatMessage;