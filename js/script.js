// Funcion Scroll

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

// Funcion Letras Animadas
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




document.addEventListener('DOMContentLoaded', function () {
  loadChatFlow();

  const chatButton = document.getElementById('chatButton');
  if (chatButton) {
    chatButton.addEventListener('click', startChat);
  }

  const closeButton = document.getElementById('closeChat');
  if (closeButton) {
    closeButton.addEventListener('click', closeChat);
  }

  const sendButton = document.getElementById('sendMessage');
  if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
  }

  function startChat() {
    console.log('Abriendo el chat...');
    document.getElementById('chatContainer').style.display = 'block';
    document.getElementById('chatButton').style.display = 'none';
    startConversation();
  }

  function closeChat() {
    console.log('Cerrando el chat...');
    document.getElementById('chatContainer').style.display = 'none';
    document.getElementById('chatButton').style.display = 'block';
  }

  function sendMessage() {
    const userMessage = document.getElementById('userInput').value;
    console.log('Mensaje del usuario:', userMessage);
    if (userMessage) {
      addMessage(userMessage, 'user-message');
      generateBotResponse(userMessage);
      document.getElementById('userInput').value = '';
    }
  }

  function addMessage(message, sender) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', sender);
    messageContainer.textContent = message;
    document.querySelector('.chat-messages').appendChild(messageContainer);
    document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
    console.log(sender === 'user-message' ? 'Mensaje enviado por el usuario: ' : 'Mensaje del bot: ', message);
  }

  let chatFlow = {};
  function loadChatFlow() {
    console.log('Cargando flujo de conversación...');
    fetch('https://franciscobellani.github.io/Mi_Portfolio_Web/chat/chatbot-flow.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo cargar el flujo de conversación');
        }
        return response.json();
      })
      .then(data => {
        chatFlow = data;
        console.log('Flujo de conversación cargado:', chatFlow);
      })
      .catch(error => {
        console.error('Error al cargar el flujo de conversación:', error);
      });
  }

  function startConversation() {
    console.log('Iniciando la conversación...');
    if (chatFlow.start && chatFlow.start.message) {
      addMessage(chatFlow.start.message, 'bot-message');
    } else {
      addMessage("Lo siento, algo salió mal al cargar el flujo de conversación.", 'bot-message');
    }
  }

  function fuzzyMatch(userInput, options, threshold = 0.65) {
    console.log('Realizando fuzzy match con entrada:', userInput);
    const bestMatch = stringSimilarity.findBestMatch(userInput.toLowerCase(), options);
    console.log('Mejor coincidencia encontrada:', bestMatch.bestMatch.target, 'con un rating de', bestMatch.bestMatch.rating);
    if (bestMatch.bestMatch.rating >= threshold) {
      return bestMatch.bestMatch.target;
    }
    return null;
  }

  // Función para procesar la respuesta del usuario
function generateBotResponse(userMessage) {
  const currentStep = chatFlow.start;  // Asegúrate de empezar desde 'start' para probar
  console.log("Paso actual:", currentStep);  // Ver el paso actual

  if (currentStep && currentStep.options) {
    // Ver si hay opciones disponibles
    console.log("Opciones del paso:", currentStep.options);  // Log de opciones

    // Fuzzy match y mostrar las opciones posibles
    const matchedOption = fuzzyMatch(userMessage, Object.keys(currentStep.options));
    console.log("Mejor coincidencia encontrada:", matchedOption);  // Log de la mejor coincidencia

    if (matchedOption) {
      const nextStepKey = currentStep.options[matchedOption];
      console.log("Clave del siguiente paso:", nextStepKey);  // Log de la clave del siguiente paso

      const nextStepData = chatFlow[nextStepKey];  // Acceder al siguiente paso usando la clave
      console.log("Datos del siguiente paso:", nextStepData);  // Log de los datos del siguiente paso

      if (nextStepData) {
        addMessage(nextStepData.message || "No hay mensaje disponible para este paso.", 'bot-message');
      } else {
        addMessage("Lo siento, no pude encontrar una respuesta apropiada para esta opción.", 'bot-message');
      }
    } else {
      addMessage('Lo siento, no entiendo tu respuesta. Intenta de nuevo.', 'bot-message');
    }
  } else {
    addMessage("Lo siento, no se encontraron opciones disponibles.", 'bot-message');
  }
}

});
