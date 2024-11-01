const fs = require('fs').promises;
const path = require('path');
const db = require('../Config/db');

const tournamentEditorService = {
    async getTournamentEditData(tournamentId) {
        return new Promise((resolve, reject) => {
            const selectTournamentQuery = "SELECT * FROM tournament WHERE id=?";
            db.query(selectTournamentQuery, [tournamentId], (err, tournamentResults) => {
                if (err) {
                    console.error('Error getTournamentEditData:tournament', err);
                    reject(err);
                } else {
                    const tournamentData = { ...tournamentResults[0], is_update: false};
                    const selectTournamentImageQuery = "SELECT * FROM tournament_image WHERE tournament_id=?";
                    db.query(selectTournamentImageQuery, [tournamentId], (err, tournamentImageResults) => {
                        if (err) {
                            console.error('Error getTournamentEditData:tournament_image', err);
                            reject(err);
                        } else {
                            const tournamentImageData = tournamentImageResults.map(image => ({...image, is_update:false}));
                            resolve({'tournament': tournamentData, 'images': tournamentImageData});
                        }
                    })
                }
            })
        })
    }
}

module.exports = tournamentEditorService;