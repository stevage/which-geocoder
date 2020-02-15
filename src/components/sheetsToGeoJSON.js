const d3 = require('d3-fetch');

export async function sheetsToGeoJSON(sheetsId) {

    const csvSource = `https://docs.google.com/spreadsheets/d/e/${sheetsId}/pub?gid=0&single=true&output=csv`;

    
    function toPoints(rows) {
        return {
            type: 'FeatureCollection',
            features: rows.map((row, id) => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [+row.Longitude, +row.Latitude], // These are the column names
                },
                properties: {
                    id,
                    ...row
                }
            }))
        }
    }

    return toPoints(await d3.csv(csvSource));
}