const apiKey = process.env.TICKETMASTER_API_KEY;

export default async function handler(req, res) {
    try {
        const { artistName } = req.query;
        const url = `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${apiKey}&keyword=${encodeURIComponent(artistName)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch attraction ID for artist: ${artistName}`);
        }

        const data = await response.json();
        const attraction = data._embedded?.attractions?.[0];  // Assume the first result is the correct one
        return res.status(200).json(attraction ? attraction.id : '');
    } catch (error) {
        console.error('Error fetching data from Ticketmaster:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}