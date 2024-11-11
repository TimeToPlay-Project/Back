const fs = require('fs').promises;
const path = require('path');
const db = require('../Config/db');

function dbQuery(query, params) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

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
    },

    async updateTournament(tournamentData, thumbnailFile, imageFileMap) {
        try {
            const tournament = tournamentData.tournament;
            const tournamentImages = tournamentData.images;
            let thumbnail = null;
    
            const tmpDir = path.join(global.appRoot, 'tmp');
            const tournamentDir = path.join(global.appRoot, 'public', 'images', 'tournament', tournament.id.toString());
    
            if (thumbnailFile) {
                try {
                    await fs.access(tournamentDir);
                } catch {
                    throw new Error(`Tournament directory does not exist: ${tournamentDir}`);
                }
    
                const targetPath = path.join(tournamentDir, thumbnailFile.filename);
                await fs.rename(thumbnailFile.path, targetPath);
    
                thumbnail = `images/tournament/${tournament.id}/${thumbnailFile.filename}`;
            }
    
            const updateTournamentQuery = thumbnail 
                ? "UPDATE tournament SET title=?, thumbnail=?, description=? WHERE id=?" 
                : "UPDATE tournament SET title=?, description=? WHERE id=?";
            const updateTournamentQueryParams = thumbnail 
                ? [tournament.title, thumbnail, tournament.description, tournament.id] 
                : [tournament.title, tournament.description, tournament.id];
            
            await dbQuery(updateTournamentQuery, updateTournamentQueryParams);
    
            const selectTournamentImageQuery = "SELECT id FROM tournament_image WHERE tournament_id=?";
            const existingTournamentImages = await dbQuery(selectTournamentImageQuery, [tournament.id]);
            const existingTournamentImageIds = existingTournamentImages.map(image => image.id);
    
            for (const tournamentImage of tournamentImages) {
                let imageUrl = null;
    
                if (imageFileMap[tournamentImage.id.toString()]) {
                    const imageFileName = imageFileMap[tournamentImage.id.toString()];
                    const tmpPath = path.join(tmpDir, imageFileName);
                    const targetPath = path.join(tournamentDir, imageFileName);
                    await fs.rename(tmpPath, targetPath);
                    imageUrl = `images/tournament/${tournament.id}/${imageFileName}`;
                }
    
                if (existingTournamentImageIds.includes(tournamentImage.id)) {
                    const updateTournamentImageQuery = imageUrl
                        ? "UPDATE tournament_image SET image_name=?, image_url=?, win_count=0 WHERE id=?"
                        : "UPDATE tournament_image SET image_name=?, win_count=0 WHERE id=?";
                    const updateTournamentImageQueryParams = imageUrl
                        ? [tournamentImage.image_name, imageUrl, tournamentImage.id]
                        : [tournamentImage.image_name, tournamentImage.id];
    
                    await dbQuery(updateTournamentImageQuery, updateTournamentImageQueryParams);
                } else {
                    const insertTournamentImageQuery = imageUrl
                        ? "INSERT INTO tournament_image(image_name, image_url, tournament_id) VALUES(?, ?, ?)"
                        : "INSERT INTO tournament_image(image_name, tournament_id) VALUES(?, ?)";
                    const insertTournamentImageQueryParams = imageUrl
                        ? [tournamentImage.image_name, imageUrl, tournament.id]
                        : [tournamentImage.image_name, tournament.id];
    
                    await dbQuery(insertTournamentImageQuery, insertTournamentImageQueryParams);
                }
            }
    
            return `updateTournament success: ${tournament.id}`;
        } catch (error) {
            throw new Error(`Error in updateTournament: ${error.message}`);
        }
    },

    async createTournament(tournamentData, thumbnailFile, imageFileMap) {
        try {
            const tournament = tournamentData.tournament;
            const tournamentImages = tournamentData.images;

            const insertTournamentQuery = "INSERT INTO tournament(title, description) VALUES(?, ?)";
            const insertTournamentResults = await dbQuery(insertTournamentQuery, [tournament.title, tournament.description]);

            const newTournamentId = insertTournamentResults.insertId;
            const tmpDir = path.join(global.appRoot, 'tmp');
            const tournamentDir = path.join(global.appRoot, 'public', 'images', 'tournament', newTournamentId.toString());
            await fs.mkdir(tournamentDir, { recursive: true });

            if (thumbnailFile) {
                const targetPath = path.join(tournamentDir, thumbnailFile.filename);
                await fs.rename(thumbnailFile.path, targetPath);
                const thumbnail = `images/tournament/${newTournamentId}/${thumbnailFile.filename}`;

                const updateTournamentQuery = "UPDATE tournament SET thumbnail=? WHERE id=?";
                dbQuery(updateTournamentQuery, [thumbnail, newTournamentId]);
            }
            for (const tournamentImage of tournamentImages) {
                let imageUrl = null;
                if (imageFileMap[tournamentImage.id]) {
                    const imageFileName = imageFileMap[tournamentImage.id];
                    const tmpPath = path.join(tmpDir, imageFileName);
                    const targetPath = path.join(tournamentDir, imageFileName);
                    await fs.rename(tmpPath, targetPath);

                    imageUrl = `images/tournament/${newTournamentId}/${imageFileName}`;
                }

                const insertTournamentImageQuery = imageUrl
                    ? "INSERT INTO tournament_image(image_name, image_url, tournament_id) VALUES(?, ?, ?)"
                    : "INSERT INTO tournament_image(image_name, tournament_id) VALUES(?, ?)";

                const insertTournamentImageQueryParamas = imageUrl
                    ? [tournamentImage.image_name, imageUrl, newTournamentId]
                    : [tournamentImage.image_name, newTournamentId];
                    
                await dbQuery(insertTournamentImageQuery, insertTournamentImageQueryParamas);
            }


        } catch (error) {
            throw new Error(`Error in createTournament: ${error.message}`);
        }
    },

    async deleteTournamentImage(tournamentImageId) { 
        try {
            const deleteTournamentImageQuery = "DELETE FROM tournament_image WHERE id=?";
            const result = await dbQuery(deleteTournamentImageQuery, tournamentImageId);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error in deleteTournamentImage: ${error.message}`);
        }
    },

    async checkImageExist(tournamentId, checkImageId) {
        try {
            const selectTournamentImageQuery = "SELECT id FROM tournament_image WHERE tournament_id=?";
            const existingTournamentImages = await dbQuery(selectTournamentImageQuery, tournamentId);
            const existingTournamentImageIds = existingTournamentImages.map(image => image.id);
            if (existingTournamentImageIds.includes(Number(checkImageId))) {
                return true;
            } else {
                return false
            }

        } catch (error) {
            throw new Error(`Error in checkImageExist: ${error.message}`);
        }
    }
}

module.exports = tournamentEditorService;