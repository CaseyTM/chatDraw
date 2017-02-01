// !!!!!!!!!!!WEBSOCKET SECTION!!!!!!!!!!!!!!!!!!!
// var socketio = io.connect('http://127.0.0.1:8080');

var socketio = io.connect('http://ec2-35-166-57-162.us-west-2.compute.amazonaws.com/:8080');


socketio.on('users', (socketUsers)=>{
	// console.log(socketUsers);
	var newHTML = "";
	socketUsers.map((currSocket, index) =>{
		newHTML += '<li class="user">' + currSocket.name + '</li>';
	});
	document.getElementById('user-names').innerHTML = newHTML;
})

socketio.on('messageToClient', (messageObject)=>{
	document.getElementById('user-chats').innerHTML += '<div class="message">' + messageObject.name + ' ' + 'says:' + ' ' + messageObject.message + 
	' ' + 'at' + ' ' + messageObject.date + '</div>'

	// console.log(messageObject.name);
});

// !!!!!!!!!!!CLIENT FUNCTIONS!!!!!!!!!!!!!!!!!!!
function sendChatMessage(){
	event.preventDefault();
	var playerName = event.target[0].value;
	console.log(playerName)
	var messageToSend = event.target[1].value;
		socketio.emit('messageToServer',{
		message: messageToSend,
		name: playerName
	});
	document.getElementById('chat-message').value = "";
}


// !!!!!!!!!!!CANVAS SECTION!!!!!!!!!!!!!!!!!!!
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// Set up base options
var color = "#000";
var thickness = 10;
var mouseDown = false;
var mousePosition = {};
var lastMousePosition = null;
var colorPick = document.getElementById('color-picker');
var thicknessPicker = document.getElementById('thickness');
colorPick.addEventListener('change', (event)=>{
	color = colorPick.value;
});

thicknessPicker.addEventListener('change', (event)=>{
	thickness = thicknessPicker.value;
});

canvas.addEventListener('mousedown', (event)=>{
	// console.log(event);
	mouseDown = true;
});

canvas.addEventListener('mouseup', (event)=>{
	// console.log(event);
	mouseDown = false;
});

canvas.addEventListener('mousemove', (event)=>{
	// console.log(event);
	if(mouseDown){
		// mouse must be down because we update this boolean in mousedown/mouseup
		var magicBrushX = event.pageX - canvas.offsetLeft;
		var magicBrushY = event.pageY - canvas.offsetTop;
		mousePosition = {
			x: magicBrushX,
			y: magicBrushY
		}
		// console.log(mousePosition);
		if(lastMousePosition !== null){
			context.strokeStyle = color;
			context.lineJoin = 'round';
			context.lineWidth = thickness;
			context.beginPath();
			context.moveTo(lastMousePosition.x, lastMousePosition.y);
			context.lineTo(mousePosition.x, mousePosition.y);
			context.stroke();
			context.closePath();
		}

		// update lastMousePosition
		var drawingDataForServer = {
			mousePosition: mousePosition,
			lastMousePosition: lastMousePosition,
			color: color,
			thickness: thickness
		}

		lastMousePosition = {
			x: mousePosition.x,
			y: mousePosition.y
		}
	
		socketio.emit('drawingToServer', drawingDataForServer);
		socketio.on('drawingToClients', (drawingData)=>{
			context.strokeStyle = drawingData.color;
			context.lineJoin = 'round';
			context.lineWidth = drawingData.thickness;
			context.beginPath();
			context.moveTo(drawingData.lastMousePosition.x, drawingData.lastMousePosition.y);
			context.lineTo(drawingData.mousePosition.x, drawingData.mousePosition.y);
			context.stroke();
			context.closePath();

		})
	}
});