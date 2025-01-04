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







// Agregamos chat:
document.addEventListener('DOMContentLoaded', function () {
  // Cargar flujo de conversación desde el archivo JSON
  loadChatFlow();

  // Botón para abrir el chat
  const chatButton = document.getElementById('chatButton');
  if (chatButton) {
    chatButton.addEventListener('click', startChat);
  } else {
    console.error('Botón de chat no encontrado.');
  }

  // Botón para cerrar el chat
  const closeButton = document.getElementById('closeChat');
  if (closeButton) {
    closeButton.addEventListener('click', closeChat);
  }

  // Botón para enviar mensajes
  const sendButton = document.getElementById('sendMessage');
  if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
  }

  // Función para abrir el chat
  function startChat() {
    document.getElementById('chatContainer').style.display = 'block';
    document.getElementById('chatButton').style.display = 'none'; // Ocultar el botón para iniciar chat
    startConversation(); // Comenzar la conversación automáticamente
  }

  // Función para cerrar el chat
  function closeChat() {
    document.getElementById('chatContainer').style.display = 'none';
    document.getElementById('chatButton').style.display = 'block'; // Mostrar el botón para iniciar chat
  }

  // Función para enviar un mensaje
  function sendMessage() {
    const userMessage = document.getElementById('userInput').value;
    if (userMessage) {
      addMessage(userMessage, 'user-message');
      generateBotResponse(userMessage); // Llamar a la función para procesar el mensaje
      document.getElementById('userInput').value = ''; // Limpiar el input
    }
  }

  // Función para agregar un mensaje al chat
  function addMessage(message, sender) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', sender);
    messageContainer.textContent = message;
    document.querySelector('.chat-messages').appendChild(messageContainer);
    document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight; // Scroll hacia abajo
  }

  // Función para cargar el flujo de conversación desde el archivo JSON
  let chatFlow = {};
  function loadChatFlow() {
    fetch('https://github.com/FranciscoBellani/Mi_Portfolio_Web/Index-con-grid/chat/chatbot-flow.json') // Ruta al archivo JSON en la carpeta CHAT
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo cargar el flujo de conversación');
        }
        return response.json();
      })
      .then(data => {
        chatFlow = data; // Asignar el flujo de conversación
        console.log('Flujo de conversación cargado:', chatFlow);
      })
      .catch(error => {
        console.error('Error al cargar el flujo de conversación:', error);
      });
  }

  // Función para iniciar la conversación (mensaje inicial)
  function startConversation() {
    if (chatFlow.start) {
      addMessage(chatFlow.start.message, 'bot-message');
    } else {
      addMessage("Lo siento, algo salió mal al cargar el flujo de conversación.", 'bot-message');
    }
  }

  // Función para generar la respuesta del bot basada en el mensaje del usuario
  let currentStep = 'start'; // Comienza en el paso inicial del flujo
  function generateBotResponse(message) {
    const step = chatFlow[currentStep];

    // Verifica si el mensaje del usuario corresponde a una opción del flujo
    if (step.options && step.options[message.toLowerCase()]) {
      currentStep = step.options[message.toLowerCase()];
      addMessage(chatFlow[currentStep].message, 'bot-message');
    } else {
      addMessage('Lo siento, no entiendo tu respuesta. Intenta de nuevo.', 'bot-message');
    }
  }
});