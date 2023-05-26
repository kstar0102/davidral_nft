import React, { useEffect } from "react";
import Winwheel from "./WheelComp";
import Modal from 'react-modal';

import BG from '../assets/planes.png';
import Pointer from '../assets/pointer.png';
import Winning from '../assets/winning.png';
import { useState } from "react";

function CustomWheel(props) {

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        window.winwheel = new Winwheel({
            'numSegments'       : 17,         // Specify number of segments.
            'outerRadius'       : 450,       // Set outer radius so wheel fits inside the background.
            'drawMode'          : 'image',   // drawMode must be set to image.
            'drawText'          : true,      // Need to set this true if want code-drawn text on image wheels.
            'textFontSize'      : 22,        // Set text options as desired.
            'textOrientation'   : 'curved',
            'textAlignment'     : 'outer',
            'textMargin'        : 5,
            'textFontFamily'    : 'monospace',
            'textStrokeStyle'   : 'black',
            'textLineWidth'     : 2,
            'textFillStyle'     : 'white',
            'segments'     :                // Define segments.
            [
               {'text' : 'BB #3401'},
               {'text' : 'BB #7772'},
               {'text' : 'BB #7577'},
               {'text' : 'BB #427'},
               {'text' : 'BB #4857'},
               {'text' : 'BB #503'},
               {'text' : 'BB #4709'},
               {'text' : 'BB #4468'},
               {'text' : 'BB #2883'},
               {'text' : 'BB #2246'},
               {'text' : 'BB #544'},
               {'text' : 'BB #486'},
               {'text' : 'BB #1599'},
               {'text' : 'BB #4244'},
               {'text' : 'BB #4600'},
               {'text' : 'BB #2738'},
               {'text' : 'BB Win!'},
            ],
            'animation' :                   // Specify the animation to use.
            {
                'type'     : 'spinToStop',
                'duration' : 5,     // Duration in seconds.
                'spins'    : 8,     // Number of complete spins.
                'callbackFinished' : alertPrize
            }
        });
          
        // Create new image object in memory.
        let loadedImg = new Image(1500, 1500);
        loadedImg.src = BG;

        // Create callback to execute once the image has finished loading.
        loadedImg.onload = function()
        {
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            ctx.clearRect(-canvas.width * 0.5, -canvas.height * 0.6, canvas.width * 2, canvas.height * 2);

            ctx.translate(-15, 270);
            ctx.drawImage(loadedImg, 0, 0);
        
            window.winwheel.wheelImage = loadedImg;    // Make wheelImage equal the loaded image object.
            window.winwheel.draw();                    // Also call draw function to render the wheel.
        }
    }, [])

    useEffect(() => {
        if (props.spin == true) startSpin()
    },[props.spin])

    function openModal() {
        setIsModalOpen(true);
    }
    
    function closeModal() {
        setIsModalOpen(false);
    }

    let wheelSpinning = false;

    function startSpin()
    {
        console.log('sssssssss', wheelSpinning)
        // Ensure that spinning can't be clicked again while already running.
        if (wheelSpinning == false) {
            window.winwheel.startAnimation();
            wheelSpinning = true;
        }
    }

    function resetWheel()
    {
        window.winwheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
        window.winwheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
        window.winwheel.draw();                // Call draw to render changes to the wheel.


        wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
    }
    function alertPrize(indicatedSegment)
    {
        // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
        alert("The wheel stopped on " + indicatedSegment.text);
        openModal();
        resetWheel()
    }


    return ( 
        <div style={{overflow: 'hidden', position: 'fixed', bottom: 0}}>
            <div width="500" height="500" className="the_wheel" valign="center">
                <img src={Pointer} alt='Logo'></img>
                <canvas id="canvas" width="1500" height="500">
                </canvas>
            </div>
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={{display: 'flex', alignItems: 'inherit', justifyContent: 'center'}}>
                <img src={Winning} alt="Winning Image" />
            </Modal>
        </div>
    );
}

export default CustomWheel;