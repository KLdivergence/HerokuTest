let pruneCurrent = (data) => {
    var current = [];
    var countmap = {};
    let history = data.history;
    
    for (var i in history) {
        var key = history[i].Username + history[i].Serial + history[i].Section + history[i].Setting;
        history[i].LastChanged = (new Date(history[i].LastChanged).toLocaleString('en-US', { hour12: false, timeZoneName: "short"}));
        if (!countmap[key]) {
            countmap[key] = 1;
            current.push(history[i]);
        }
    }
    data.current = current;
}

let loadSummary = (data) => {
    setTimeout( ()=> {
        // some code
    }, 500)
    data.$http.post('/gethistory', data.requestBody,{ timeout: 200000 }).then(resp => {
        data.history = resp.data;
        pruneCurrent(data);
    }, resp => {
        data.message = "Error: Couldn't fetch the log";
    })
}

module.exports = {
    loadSummary: loadSummary,
    pruneCurrent: pruneCurrent
};
