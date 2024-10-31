const express = require('express');
const tournamentEditorController = require('../Controllers/TournamentEditorController');
const tournamentEditorRoute = express.Router();

tournamentEditorRoute.get('/:tournamentId', tournamentEditorController.fetchTournamentEditData);

module.exports = tournamentEditorRoute;