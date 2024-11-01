const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});
const tournamentEditorController = require('../Controllers/TournamentEditorController');
const tournamentEditorRoute = express.Router();

tournamentEditorRoute.get('/:tournamentId', tournamentEditorController.fetchTournamentEditData);
tournamentEditorRoute.post(
    '/submit/:tournamentId',
    upload.fields([
        { name: 'thumbnail'},
        { name: 'images'}
    ]),
    tournamentEditorController.updateTournamentEditData
);

module.exports = tournamentEditorRoute;