const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'tmp'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
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