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

    async updateTournamentEditData(req, res) {
        const { tournamentId } = req.params;

        console.log("updateTournamentEditData:", tournamentId);
    
        const tournamentData = JSON.parse(req.body.tournamentData);
        
        const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
        const imageFiles = req.files['images'] || [];
    
        console.log("tournamentData:", tournamentData);
        console.log("thumbnailFile:", thumbnailFile);
        console.log("imageFiles:", imageFiles);
    
        res.status(200).json({ message: "updateTournamentEditData" });
    }
    
}

module.exports = tournamentEditorController;
