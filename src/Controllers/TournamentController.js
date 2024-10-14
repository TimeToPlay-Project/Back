const tournamentService = require('../Services/TournamentService');

const tournamentController = {
    async getTournaments(req, res) {
        const tournaments = await tournamentService.getTournaments();
        res.json(tournaments);
    },

    async getTournamentCounts(req, res) {
        const { tournamentId } = req.params;
        console.log('request getTournamentCounts:', tournamentId);

        const counts = await tournamentService.getTournamentCountOptions(tournamentId);

        res.json(counts);
    },

    async getTournamentImages(req, res) {
        const { tournamentId, count } = req.params;
        console.log('request getTournamentImages:', tournamentId, count);

        if (!tournamentId || !count) {
            return res.status(400).json({ message: 'Tournament ID and count are required' });
        }
        const imageUrls = await tournamentService.getTournamentImages(tournamentId, count);
        
        res.json(imageUrls);
    },

    async getTournamentRanking(req, res) {
        const { tournamentId } = req.params;
        console.log('request getTournamentRanking:', tournamentId);

        const tournamentRanking = await tournamentService.getTournamentRanking(tournamentId);

        res.json(tournamentRanking);
    },

    async updateTournamentWinner(req, res) {
        const { winnerId } = req.params;
        console.log('request updateTournamentWinner', winnerId);
        const result = await tournamentService.updateTournamentWinner(winnerId);

        res.json(result);
    }
}

module.exports = tournamentController;