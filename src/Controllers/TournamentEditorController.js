const tournamentEditorService = require('../Services/TournamentEditorService');

const tournamentEditorController = {
    async fetchTournamentEditData(req, res) {
        const { tournamentId } = req.params;
        console.log('request fetchTournamentEditData:', tournamentId);

        try {
            const tournamentEditData = await tournamentEditorService.getTournamentEditData(tournamentId);
            res.json(tournamentEditData);
        } catch (error) {
            console.error('Error in fetchTournamentEditData: ', error);
            res.status(500).json({error: 'Error in fetchTournamentEditData: '});
        }
    },
}

module.exports = tournamentEditorController;
