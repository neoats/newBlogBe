const songLyrics = `Bist du traurig, so wie ich? Dir laufen Tränen vom Gesicht Komm zu uns und reih dich ein Wir woll’n zusammen traurig sein Komm mit Komm mit Warum stehst du noch am Rande? Reih dich ein in unsre Bande Wenn wir dann im Trist marschieren Gar nichts, nichts, kann dir passieren`;

export const test = async (req, res) => {
/*   const formattedLyrics = songLyrics.split('\n').map(line => `<p>${line}</p>`).join('');
  const lyricsObject = { lyrics: formattedLyrics }; */
  res.json(songLyrics);
};
