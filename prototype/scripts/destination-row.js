function countryFlag(country) {
  return '<span class="country-flag" aria-hidden="true">' +
    [...country.id.toUpperCase()].map(letter => String.fromCodePoint(127397 + letter.charCodeAt(0))).join('') + '</span>';
}

function destinationRow(country, href) {
  const film = country.films[0];
  const image = film ? '<img src="https://i.ytimg.com/vi/' + film.id + '/mqdefault.jpg" alt="" loading="lazy" decoding="async">' : '';
  const places = country.places.split(' · ').filter(Boolean).map(place => '<span>' + place + '</span>').join(' ');
  return '<li><a id="country-' + country.id + '" class="destination-row" href="' + href + '">' +
    '<span class="destination-row__thumb">' + image + '</span><div class="destination-row__text">' +
    '<strong>' + countryFlag(country) + ' ' + country.name + '</strong>' +
    (places ? '<span class="destination-row__places">' + places + '</span>' : '') + '</div></a></li>';
}
