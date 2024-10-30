const express = require('express');
const tournamentController = require('../Controllers/TournamentController');
const router = express.Router();

router.get('/all', tournamentController.fetchTournaments);
router.get('/start/:tournamentId', tournamentController.fetchTournamentStartData);
router.get('/images/:tournamentId/:count', tournamentController.fetchTournamentImages);
router.get('/ranking/:tournamentId', tournamentController.fetchTournamentRanking);
router.get('/winner/:winnerId', tournamentController.updateTournamentWinner);

module.exports = router;