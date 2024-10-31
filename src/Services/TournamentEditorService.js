const fs = require('fs').promises;
const path = require('path');
const db = require('../Config/db');

const tournamentEditorService = {
    async getTournamentEditData(tournamentId) {
        return new Promise((resolve, reject) => {
            const selectTournamentQuery = "SELECT * FROM tournament WHERE id=?";
            db.query(selectTournamentQuery, [tournamentId], (err, tournamentData) => {
                if (err) {
                    console.error('Error getTournamentEditData:tournament', err);
                    reject(err);
                } else {
                    const selectTournamentImageQuery = "SELECT * FROM tournament_image WHERE tournament_id=?";
                    db.query(selectTournamentImageQuery, [tournamentId], (err, tournamentImageData) => {
                        if (err) {
                            console.error('Error getTournamentEditData:tournament_image', err);
                            reject(err);
                        } else {
                            resolve({'tournament': tournamentData, 'images': tournamentImageData});
                        }
                    })
                }
            })
        })
    }
}

module.exports = tournamentEditorService;