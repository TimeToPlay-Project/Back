const express = require('express');
const tournamentController = require('../Controllers/TournamentController');
const router = express.Router();

router.get('/images/:tournamentId/:count', tournamentController.getTournamentImages);

module.exports = router;