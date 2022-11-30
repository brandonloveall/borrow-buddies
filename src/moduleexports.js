module.exports = {
    termToSearch: (string) => {
        return `search?term=${string.toLowerCase().replace(/[^a-zA-Z\d\s]/gm, "").replace(/ /gm, "_")}`
    }
}