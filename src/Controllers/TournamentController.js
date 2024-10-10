const tournamentService = require('../Services/TournamentService');

const tournamentController = {
    async getTournamentImages(req, res) {
        const { tournamentId, count } = req.params;
        console.log('request getTournamentImages:', tournamentId, count);

        if (!tournamentId || !count) {
            return res.status(400).json({ message: 'Tournament ID and count are required' });
        }
        const imageUrls = await tournamentService.getTournamentImages(tournamentId, count);
        
        res.json(imageUrls);
    },
}

module.exports = tournamentController;