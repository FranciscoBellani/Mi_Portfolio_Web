// Chat Bot
document.addEventListener("DOMContentLoaded", function () {
    loadChatFlow();
  
    const chatButton = document.getElementById("chatButton");
    if (chatButton) {
      chatButton.addEventListener("click", startChat);
    }
  
    const closeButton = document.getElementById("closeChat");
    if (closeButton) {
      closeButton.addEventListener("click", closeChat);
    }
  
    const sendButton = document.getElementById("sendMessage");
    if (sendButton) {
      sendButton.addEventListener("click", sendMessage);
    }
  
    function startChat() {
      console.log("Abriendo el chat...");
      document.getElementById("chatContainer").style.display = "block";
      document.getElementById("chatButton").style.display = "none";
      startConversation();
    }
  
    function closeChat() {
      console.log("Cerrando el chat...");
      document.getElementById("chatContainer").style.display = "none";
      document.getElementById("chatButton").style.display = "block";
    }
  
    function sendMessage() {
      console.log("Enviando mensaje...");
    
      const userInputElement = document.getElementById("userInput");
      const userMessage = userInputElement.value.trim(); // Limpiar espacios extra
    
      if (userMessage !== "") {
        console.log("Mensaje ingresado por el usuario:", userMessage);
    
        addMessage(userMessage, "user-message");
        generateBotResponse(userMessage);
    
        console.log("Borrando input...");
        userInputElement.value = "";
        console.log("Input borrado.");
      } else {
        console.log("El input estaba vacío, no se envió mensaje.");
      }
    
      // Enfocar el campo de input en ambos casos
      console.log("Enfocando el campo de input...");
      userInputElement.focus();
      console.log("Input listo para nuevo tipeo.");
    }
    
  
    function addMessage(message, sender) {
      // Detectar enlaces, correos y números de WhatsApp
      const linkifiedMessage = message
        .replace(
          /(https?:\/\/[^\s]+)/g,
          '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        )
        .replace(
          /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g,
          '<a href="mailto:$1">$1</a>'
        )
        .replace(
          /\b(\+?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{4,})\b/g,
          '<a href="https://wa.me/$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
    
      // Crear el contenedor del mensaje
      const messageContainer = document.createElement("div");
      messageContainer.classList.add("message", sender);
      messageContainer.innerHTML = linkifiedMessage;
    
      document.querySelector(".chat-messages").appendChild(messageContainer);
      document.querySelector(".chat-messages").scrollTop =
        document.querySelector(".chat-messages").scrollHeight;
    
      console.log(
        sender === "user-message"
          ? "Mensaje enviado por el usuario: "
          : "Mensaje del bot: ",
        message
      );
    }
    
  
    let chatFlow = {};
    let currentStepKey = "start";
  
    function loadChatFlow() {
      console.log("Cargando flujo de conversación...");
      fetch(
        "https://franciscobellani.github.io/Mi_Portfolio_Web/chat/chatbot-flow.json"
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se pudo cargar el flujo de conversación");
          }
          return response.json();
        })
        .then((data) => {
          chatFlow = data;
          console.log("Flujo de conversación cargado:", chatFlow);
        })
        .catch((error) => {
          console.error("Error al cargar el flujo de conversación:", error);
        });
    }
  
    function startConversation() {
      console.log("Iniciando la conversación...");
      if (chatFlow.start && chatFlow.start.message) {
        addMessage(chatFlow.start.message, "bot-message");
      } else {
        addMessage(
          "Lo siento, algo salió mal al cargar el flujo de conversación.",
          "bot-message"
        );
      }
    }
  
    function fuzzyMatch(userInput, options, threshold = 0.65) {
      console.log("Realizando fuzzy match con entrada:", userInput);
      const bestMatch = stringSimilarity.findBestMatch(
        userInput.toLowerCase(),
        options
      );
      console.log(
        "Mejor coincidencia encontrada:",
        bestMatch.bestMatch.target,
        "con un rating de",
        bestMatch.bestMatch.rating
      );
      if (bestMatch.bestMatch.rating >= threshold) {
        return bestMatch.bestMatch.target;
      }
      return null;
    }
  
    function processUserInput(userInput) {
      console.log("Procesando entrada del usuario:", userInput);
  
      const currentStep = chatFlow[currentStepKey];
      console.log("Paso actual:", currentStep);
  
      if (currentStep && currentStep.options) {
        const options = currentStep.options;
        const matchedOption = fuzzyMatch(userInput, Object.keys(options));
  
        console.log("Mejor coincidencia encontrada:", matchedOption);
  
        if (matchedOption) {
          const nextStepKey = options[matchedOption];
          console.log("Clave del siguiente paso:", nextStepKey);
          currentStepKey = nextStepKey;
          const nextStepData = chatFlow[nextStepKey];
          addMessage(
            nextStepData.message || "No hay mensaje disponible para este paso.",
            "bot-message"
          );
          
        } else {
          addMessage(
            "Lo siento, no pude encontrar una respuesta apropiada.",
            "bot-message"
          );
        }
      } else {
        addMessage(
          "Lo siento, no se encontraron opciones disponibles.",
          "bot-message"
        );
      }
    }
  
    function generateBotResponse(userMessage) {
      processUserInput(userMessage);
    }
  
    const userInput = document.getElementById("userInput");
    if (userInput) {
      userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          sendMessage();
        }
      });
    }
  });

  