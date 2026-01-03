# Spotify Clone

A simple web-based music player that looks and works like Spotify. Built with HTML, CSS, and vanilla JavaScript.

## What it does

- Play music files from your local folders
- Skip between songs (next/previous)
- Control volume and mute/unmute
- See song progress with a seek bar
- Browse different albums
- Automatically plays the next song when one ends
- Works on mobile devices too

## How to run it

1. Clone this repo:
```bash
git clone https://github.com/theqafas/streamlit.git
cd streamlit/spotify-clone
```

2. Start a local server (you need this because of how the audio files are loaded):
```bash
python -m http.server 8000
```

3. Open your browser and go to `http://localhost:8000`

That's it!

## Project structure

```
spotify-clone/
├── index.html          # Main page
├── css/               # Styles
├── js/                # JavaScript code
├── img/               # Icons and images
└── songs/             # Music files (each album in its own folder)
```

## How to add your own music

1. Create a new folder in the `songs/` directory
2. Put your MP3 files in there
3. Add a `cover.jpg` for the album art
4. Create an `info.json` file like this:
```json
{
  "title": "Your Album Name",
  "description": "Some description here"
}
```

## Technologies used

- HTML5
- CSS3 (flexbox and grid)
- JavaScript (ES6)
- HTML5 Audio API

## Known issues

- The server needs to be running on port 3000 for some features (you might need to adjust the fetch URLs in `js/index.js` if you use a different port)
- Song files need to have the `[SPOTIFY-DOWNLOADER.COM]` prefix in their names (check the code if you want to change this)

## Credits

Original concept from [mdaiyaz940's spotify-clone](https://github.com/mdaiyaz940/spotify-clone)

## License

Feel free to use this for learning or personal projects.