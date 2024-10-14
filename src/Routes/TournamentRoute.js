const express = require('express');
const tournamentController = require('../Controllers/TournamentController');
const router = express.Router();

router.get('/all', tournamentController.getTournaments);
router.get('/counts/:tournamentId', tournamentController.getTournamentCounts);
router.get('/images/:tournamentId/:count', tournamentController.getTournamentImages);
router.get('/ranking/:tournamentId', tournamentController.getTournamentRanking);
router.get('/winner/:winnerId', tournamentController.updateTournamentWinner);

module.exports = router;