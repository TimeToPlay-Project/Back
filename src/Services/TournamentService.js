const fs = require('fs').promises;
const path = require('path');
const db = require('../Config/db');
const { getTournamentImages } = require('../Controllers/TournamentController');

const tournamentService = {
    async getTournaments() {
        return new Promise((resolve, reject) => {
            db.query('select * from tournament', (err, results) => {
                if (err) {
                    console.error('error fetching tournament', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },

    async getTournamentCountOptions(tournamentId) {
        return new Promise((resolve, reject) => {
            db.query('select count(*) as count from tournament_image where tournament_id = ?', [tournamentId], (err, results) => {
                if (err) {
                    console.error('error fetching tournament count', err);
                    reject(err);
                } else {
                    const count = results[0].count;
                    const countOptions = [];

                    let roundSize = Math.pow(2, Math.floor(Math.log2(count)));
                    
                    while (roundSize >= 4 && count >= roundSize) {
                        countOptions.push({ key: roundSize.toString(), value: `${roundSize}강` });
                        roundSize /= 2;
                    }
                    resolve(countOptions);
                }
            })
        })
    },

    async getTournamentImages(tournamentId, count) {
        return new Promise((resolve, reject) => {
            db.query('select * from tournament_image where tournament_id = ?', [tournamentId], (err, results) => {
                if (err) {
                    console.error('error fetching tournament images', err);
                    reject(err);
                } else {
                    const shuffledImages = results.sort(() => Math.random() - 0.5);
                
                    const selectedImages = shuffledImages.slice(0, count);
                    
                    resolve(selectedImages);
                }
            })
        })
    },

    async getTournamentRanking(tournamentId) {
        return new Promise((resolve, reject) => {
            db.query('select sum(win_count) as total_win_count from tournament_image where tournament_id = ?', [tournamentId], (err, totalResult) => {
                if (err) {
                    console.error('Error fetching total win_count', err);
                    reject(err);
                } else {
                    const totalWinCount = totalResult[0].total_win_count;
                    db.query('select * from tournament_image where tournament_id= ? order by win_count desc', [tournamentId], (err, results) => {
                        if (err) {
                            console.error('error fetching tournament ranking', err);
                            reject(err);
                        } else {
                            const tournaemntRanking = [];
        
                            for (let i=0; i<results.length; i++) {
                                const row = results[i];
                                const winRate = totalWinCount > 0 ? (row.win_count / totalWinCount) * 100 : 0;
                                tournaemntRanking.push({
                                    id: row.id,
                                    name: row.image_name,
                                    url: row.image_url,
                                    rate: winRate.toFixed(2)
                                });
                            }
                            resolve(tournaemntRanking);
                        }
                    })
                }
            })
        })
    },

    async updateTournamentWinner(winnerId) {
        return new Promise((resolve, reject) => {
            db.query('update tournament_image set win_count = win_count + 1 where id = ?', [winnerId], (err, results) => {
                if (err) {
                    console.error('error updating tournament winner', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    },

    

    // async getTournamentImages(tournamentId, count) {
    //     try {
    //         const imagesPath = path.join(__dirname, '../../public/images/tournament', tournamentId);

    //         const files = await fs.readdir(imagesPath);

    //         const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
    //         const numberOfImages = parseInt(count, 10) || 0;

    //         const shuffledImages = images.sort(() => 0.5 - Math.random());
    //         const selectedImages = shuffledImages.slice(0, numberOfImages);

    //         const imageUrls = selectedImages.reduce((acc, fileName) => {
    //             const fileId = path.basename(fileName, path.extname(fileName));
    //             acc[fileId] = `http://localhost:4000/images/tournament/${tournamentId}/${fileName}`;
    //             return acc;
    //         }, {});

    //         return imageUrls;
    //     } catch (error) {
    //         console.error('Error fetching tournament images:', error);
    //         throw error;
    //     }
    // },
}

module.exports = tournamentService;
