const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(global.appRoot, 'tmp'));
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
    '/update/:tournamentId',
    upload.fields([
        { name: 'thumbnail'},
        { name: 'images'}
    ]),
    tournamentEditorController.updateTournamentEditData
);

tournamentEditorRoute.post(
    '/create',
    upload.fields([
        { name: 'thumbnail'},
        { name: 'images'}
    ]),
    tournamentEditorController.createTournamentEditData
);

module.exports = tournamentEditorRoute;