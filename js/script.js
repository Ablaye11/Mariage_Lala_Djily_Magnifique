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

window.open(whatsappUrl,'_blank');
alert('Message WhatsApp ouvert!');
this.reset();
});
