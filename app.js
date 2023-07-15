require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');// require spotify-web-api-node package here:

// const spotify = require('../models/spotify.model');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID || "8daad0c2d3294a27aea034f0ae8eb81f",
    clientSecret: process.env.CLIENT_SECRET || "08f7daccc65b4731a27f02aed94ef6aa"
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res, next) => res.render("index"));


app.get('/artist-search', (req, res, next) => {

    const artist = req.query.artist;

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const artists = data.body.artists.items;
            res.render('artista', { artists });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            const albums = data.body.items;
            res.render('albums', { tracks: albums });
        })
        .catch(err => console.log('The error while retrieving artist albums occurred: ', err));
});

app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;

    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            const tracks = data.body.items;
            res.render('tracks', { tracks });
        })
        .catch(err => console.log('The error while retrieving album tracks occurred: ', err));
});









// module.exports = router;

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
