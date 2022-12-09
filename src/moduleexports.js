module.exports = {
    termToSearch: (string) => {
        return `search?term=${string.toLowerCase().replace(/[^a-zA-Z\d\s]/gm, "").replace(/ /gm, "_")}&page=1`
    },

    locationToSearch: (string) => {
        return `${string.toLowerCase().replace(/[^a-zA-Z\d\s]/gm, "").replace(/ /gm, "_")}`
    }
}