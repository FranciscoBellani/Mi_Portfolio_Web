function smoothScrollTo(targetId) {
  var target = document.getElementById(targetId);
  if (target) {
    console.log("Elemento encontrado:", targetId);
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'  // Puede ajustar 'start', 'center', o 'end' según lo que necesites
    });
  } else {
    console.log("Elemento no encontrado:", targetId);
  }
}

var words = document.getElementsByClassName('word');
var wordArray = [];
var currentWord = 0;

words[currentWord].style.opacity = 1;
for (var i = 0; i < words.length; i++) {
  splitLetters(words[i]);
}

function changeWord() {
  var cw = wordArray[currentWord];
  var nw = currentWord == words.length-1 ? wordArray[0] : wordArray[currentWord+1];
  for (var i = 0; i < cw.length; i++) {
    animateLetterOut(cw, i);
  }
  
  for (var i = 0; i < nw.length; i++) {
    nw[i].className = 'letter behind';
    nw[0].parentElement.style.opacity = 1;
    animateLetterIn(nw, i);
  }
  
  currentWord = (currentWord == wordArray.length-1) ? 0 : currentWord+1;
}

function animateLetterOut(cw, i) {
  setTimeout(function() {
		cw[i].className = 'letter out';
  }, i*80);
}

function animateLetterIn(nw, i) {
  setTimeout(function() {
		nw[i].className = 'letter in';
  }, 340+(i*80));
}

function splitLetters(word) {
  var content = word.innerHTML;
  word.innerHTML = '';
  var letters = [];
  for (var i = 0; i < content.length; i++) {
    var letter = document.createElement('span');
    letter.className = 'letter';
    letter.innerHTML = content.charAt(i);
    word.appendChild(letter);
    letters.push(letter);
  }
  
  wordArray.push(letters);
}

changeWord();
setInterval(changeWord, 4000);


// Slider del Index de habilidades

const sliderContainer = document.querySelector('.slider-container');
const slider = document.querySelector('.slider');

// Clona los elementos para crear un efecto de bucle infinito
const items = [...slider.children];
items.forEach(item => {
  const clone = item.cloneNode(true); // Clona cada ítem
  slider.appendChild(clone); // Agrega los clones al final del slider
});

// Configura la animación infinita
let scrollAmount = 0;
function scrollSlider() {
  scrollAmount += 1; // Incrementa el desplazamiento
  if (scrollAmount >= slider.scrollWidth / 2) {
    scrollAmount = 0; // Reinicia el desplazamiento cuando llega al final
  }
  slider.style.transform = `translateX(-${scrollAmount}px)`; // Aplica el desplazamiento
}

// Ajusta la velocidad del carrusel
setInterval(scrollSlider, 20); // Cambia el valor para ajustar la velocidad



  
