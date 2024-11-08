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
        const imageFileMap = JSON.parse(req.body.imageFileMap);
        const imageFiles = req.files['images'] || [];
    
        console.log("tournamentData:", tournamentData);
        console.log("thumbnailFile:", thumbnailFile);
        console.log("imageFileMap:", imageFileMap);
        console.log("imageFiles:", imageFiles);

        try {
            const result = tournamentEditorService.updateTournament(tournamentData, thumbnailFile, imageFileMap);
            res.status(200).json({message: result});
        } catch (error) {
            console.error('Error in updateTournamentEditData: ', error);
            res.status(500).json({message: error});
        }
    },

    async createTournamentEditData(req, res) {
        const tournamentData = JSON.parse(req.body.tournamentData);
        const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
        const imageFileMap = JSON.parse(req.body.imageFileMap);
        const imageFiles = req.files['images'] || [];
    
        console.log("tournamentData:", tournamentData);
        console.log("thumbnailFile:", thumbnailFile);
        console.log("imageFileMap:", imageFileMap);
        console.log("imageFiles:", imageFiles);

        try {
            const result = tournamentEditorService.createTournament(tournamentData, thumbnailFile, imageFileMap);
            res.status(200).json({message: result});
        } catch (error) {
            console.error('Error in createTournamentEditData: ', error);
            res.status(500).json({message: error});
        }
    }
    
}

module.exports = tournamentEditorController;
