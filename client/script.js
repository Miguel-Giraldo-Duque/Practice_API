import bot from "./assets/bot.svg"
import user from "./assets/user.svg"

const form = document.querySelector("form");
const chatConteiner =  document.querySelector("#chat_conteiner")


let loadInterval ;


function louder(element) {
  element.textContent = "";

  loadInterval = setInterval (() =>{
    element.textContent += ".";

    if (element.textContent === "...") {
      element.textContent = "";
    }
  } , 300)
}

function typeText(element , text) {
  let index = 0 

  let interval = setInterval(() =>{
    if (index < text.length) {
      element.innerHTML += text.charAt(index)
      index++;

    }else{
      clearInterval(interval)
    }
  }, 20)
}



function generateUniqueId() {
    const time = Date.now()
    const ramdomNumber = Math.random()
    const hexadecimalString = ramdomNumber.toString(16)

    return `id-${time}-${hexadecimalString}`
}




function chatStripe(isAi, value,uniqueId){
  return(
    `  
      <div class = "wrapper ${isAi && "ai"}">
        <div class = "chat">
          <div class = "profile">
            <img  
              src = "${isAi ? bot : user}"
              alt = "${isAi ? bot : "user"}"
            />
          </div>
          <div class = "message" id=${uniqueId}> 
            ${value}
          </div>
      </div> 
    `
  )

}


const handleSumbit = async (e) =>{
  e.preventDefault()

  const data = new FormData(form)

  chatConteiner.innerHTML += chatStripe(false, data.get("prompt"))

  form.reset();

  const uniqueId = generateUniqueId();
  chatConteiner.innerHTML += chatStripe(true, "  " , uniqueId)

  chatConteiner.scrollTop = chatConteiner.scrollHeight;


  const messageDiv =  document.getElementById(uniqueId);


  louder(messageDiv)



  const response =  await fetch("https://trustify.onrender.com" ,{
    method: "POST",
    headers:{
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
      prompt : data.get("prompt")
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = "  "

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim()

    console.log({parsedData})

    typeText(messageDiv, parsedData)
  }else{
    const err = await response.text()

    messageDiv.innerHTML = "Something went wrong"
  }

}


form.addEventListener("submit", handleSumbit);
form.addEventListener("keyup" , (e) =>{
  if (e.keyCode === 13) {
    handleSumbit(e)
  }
})