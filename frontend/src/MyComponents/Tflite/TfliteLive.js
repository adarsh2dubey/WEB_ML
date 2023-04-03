
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import io from 'socket.io-client';


const TfliteLive = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    
   
    // Implemented socket code to send screenshot of live camera to Flask backend inorder to detect object

    useEffect(() => {


      const socket = io("localhost:5001/", {
        transports: ["websocket"],
        cors: {
          origin: "http://localhost:3000/",
        },
      });
      setTimeout(myTimer, 5000)
      
      function myTimer() {
        const imageSrc = webcamRef.current.getScreenshot();
      
  
        socket.emit('frame', { imageSrc });
      }

      socket.on('list_data', (jsonList) => {
        // const data = JSON.parse(jsonList);  // Convert the JSON string back to a list of JSON objects
        myTimer()
        console.log("data are",jsonList)
        drawRect(jsonList)
      });
    }, []);
    
  

     // This is function used to draw boundary box around detected object
      function drawRect(res){
       
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, 300, 300);
        console.log("vro",res)
        res.forEach(resp=> {
         
          // Extract boxes and classes
          const [xmin, ymin, xmax, ymax] = resp['bbox']; 
          const text = resp['class_name']; 
      
          // Set styling
          const color = Math.floor(Math.random()*16777215).toString(16);
          ctx.strokeStyle = '#' + color
          ctx.font = '22px Arial';
          ctx.fontWeight ='bold'
         
          // Draw rectangles and text
          ctx.beginPath();   
          ctx.fillStyle = '#' + color
        
          const x = xmin * 300;
          const y = ymin * 300;
          const width = (xmax - xmin) * 300;
          const height = (ymax - ymin) * 300;
          ctx.fillText(text, x,y);
          ctx.rect(x, y, width,height); 
          ctx.stroke();
        });
      
       }
    
  return (
    <div className="App">
    <header className="App-header">
      <Webcam
        ref={webcamRef}
        muted={true} 
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: "90vw",
          height: "90vh",
        }}
      />

      <canvas
        id="canvas"
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          border:"1rem solid black ",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 8,
          width: "90vw",
          height: "90vh",
        }}
      />
    </header>
  </div>
  )
}
export default TfliteLive;