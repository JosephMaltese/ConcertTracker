const apiKey = process.env.TICKETMASTER_API_KEY;

export default async function handler(req, res) {
    try {
        const { attractionId, geoHash } = req.query;
        
        if (!attractionId) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        
        // No geoHash, just find all concerts for the attractionId
        if (!geoHash) {
            const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&attractionId=${attractionId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (response.status !== 200) {
                return res.status(400).json({ error: 'Failed to fetch data' });
            }
            
            const data = await response.json();
            return res.status(200).json(data);
        }


        const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&attractionId=${attractionId}&geoPoint=${geoHash}&radius=100`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
        });

        if (response.status !== 200) {
            return res.status(400).json({ error: 'Failed to fetch data' });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching data from Ticketmaster:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}