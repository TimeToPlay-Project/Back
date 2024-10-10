const fs = require('fs').promises;
const path = require('path');

const tournamentService = {
    async getTournamentImages(tournamentId, count) {
        try {
            const imagesPath = path.join(__dirname, '../../public/images/tournament', tournamentId);

            const files = await fs.readdir(imagesPath);

            const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
            const numberOfImages = parseInt(count, 10) || 0;

            const shuffledImages = images.sort(() => 0.5 - Math.random());
            const selectedImages = shuffledImages.slice(0, numberOfImages);

            const imageUrls = selectedImages.reduce((acc, fileName) => {
                const fileId = path.basename(fileName, path.extname(fileName));
                acc[fileId] = `http://localhost:4000/images/tournament/${tournamentId}/${fileName}`;
                return acc;
            }, {});

            return imageUrls;
        } catch (error) {
            console.error('Error fetching tournament images:', error);
            throw error;
        }
    },
}

module.exports = tournamentService;
