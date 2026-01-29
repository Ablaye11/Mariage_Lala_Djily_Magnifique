const d=new Date('2026-01-31').getTime();
setInterval(()=>{
const n=new Date().getTime(),x=d-n;
document.getElementById('countdown').innerHTML=Math.floor(x/(1000*60*60*24))+' jours avant le grand jour';
},1000);

document.getElementById('rsvpForm').addEventListener('submit',function(e){
e.preventDefault();
const nom=document.getElementById('nom').value;
const tel=document.getElementById('telephone').value;
const presence=document.getElementById('presence').value;

let message;
if(presence==='Oui'){
message=`Bonjour,%0AJe m'appelle ${nom}%0ATéléphone: ${tel}%0AOui, je vais être présent au mariage!%0A%0A📍 Localisation:%0Ahttps://maps.google.com/maps/place/14°43'39.0"N+17°18'47.7"W`;
}else if(presence==='Non'){
message=`Bonjour,%0AJe m'appelle ${nom}%0ATéléphone: ${tel}%0ANon, j'ai un empêchement et je ne pourrai pas être présent.%0A%0A📍 Localisation:%0Ahttps://maps.google.com/maps/place/14°43'39.0"N+17°18'47.7"W`;
}

const whatsappUrl=`https://wa.me/221763625243?text=${message}`;
// jouer un son de confirmation (Web Audio) puis ouvrir WhatsApp
if (typeof playClick === 'function') playClick();
setTimeout(function(){
	window.open(whatsappUrl,'_blank');
	alert('Message WhatsApp ouvert!');
}, 120);
this.reset();
});

// Ouvrir l'itinéraire dans Google Maps.
// Essaie d'utiliser la géolocalisation pour définir l'origine; sinon ouvre la page directions avec seulement la destination.
function openDirections() {
	const destLat = 14.7275;
	const destLng = -17.31325;
	const coordinates = `${destLat},${destLng}`;
	const travelmode = 'driving';

	const statusEl = document.getElementById('directionsStatus');
	const btn = document.getElementById('getDirectionsBtn');
	const link = document.getElementById('directionsLink');
	const statusText = document.getElementById('directionsText');
	const spinnerEl = document.getElementById('directionsSpinner');
	const placeId = link && link.dataset && link.dataset.placeId ? link.dataset.placeId.trim() : '';

	const buildUrl = (origin) => {
		const destinationParam = placeId ? `place_id:${placeId}` : coordinates;
		let url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationParam)}&travelmode=${travelmode}`;
		if (origin) url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destinationParam)}&travelmode=${travelmode}`;
		return url;
	};

	const openUrl = (url) => {
		window.open(url, '_blank');
		if (statusText) statusText.textContent = '';
		if (spinnerEl) spinnerEl.style.display = 'none';
		if (btn) btn.disabled = false;
	};

	if (btn) btn.disabled = true;
	if (statusText) statusText.textContent = 'Obtention de la position...';
	if (spinnerEl) spinnerEl.style.display = 'inline-block';

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			const origin = position.coords.latitude + ',' + position.coords.longitude;
			openUrl(buildUrl(origin));
		}, function(error){
			openUrl(buildUrl(null));
		}, {timeout:10000});
	} else {
		openUrl(buildUrl(null));
	}
}

// Attache l'écouteur au bouton ajouté dans index.html
document.addEventListener('DOMContentLoaded', function(){
	const btn = document.getElementById('getDirectionsBtn');
	if(btn){
		btn.addEventListener('click', function(e){
			e.preventDefault();
			if (typeof playClick === 'function') playClick();
			openDirections();
		});
	}
});

// --- Autoplay music (muted initially, unmute on first user interaction) ---
document.addEventListener('DOMContentLoaded', function(){
  const audio = document.getElementById('siteAudio');
  if (!audio) return;

  // Set default volume
  try{ audio.volume = 0.65; }catch(e){}

  // On first user interaction (click, key, touch), unmute and ensure playing
  const unmute = () => {
    audio.muted = false;
    audio.play().catch(()=>{}); // ignore errors
    window.removeEventListener('click', unmute);
    window.removeEventListener('keydown', unmute);
    window.removeEventListener('touchstart', unmute);
  };

  window.addEventListener('click', unmute);
  window.addEventListener('keydown', unmute);
  window.addEventListener('touchstart', unmute);
});// --- Son synthétique via Web Audio (ne nécessite pas de fichier audio) ---
// Joue un court 'click' sonore. Utilise un AudioContext démarré au premier appel.
let _audioCtx = null;
function playClick(){
	try{
		if(!_audioCtx){
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			_audioCtx = new AudioContext();
		}
		const ctx = _audioCtx;
		const o = ctx.createOscillator();
		const g = ctx.createGain();
		o.type = 'sine';
		o.frequency.value = 880; // fréquence en Hz
		g.gain.value = 0.0001; // commencer très bas pour éviter pop
		o.connect(g);
		g.connect(ctx.destination);
		const now = ctx.currentTime;
		g.gain.setValueAtTime(0.0001, now);
		g.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
		o.start(now);
		g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
		o.stop(now + 0.13);
	}catch(e){
		// si WebAudio non supporté, on ignore silencieusement
		console.warn('playClick: WebAudio error', e);
	}
}
