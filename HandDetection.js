import React, { useRef, useEffect } from 'react';
import * as hands from '@mediapipe/hands';
import * as tf from '@tensorflow/tfjs';

const HandDetection = () => {
  const videoRef = useRef(null);
  const handDetectionRef = useRef(null);

  useEffect(() => {
    const runHandDetection = async () => {
      await tf.setBackend('webgl');

      const handsModule = new hands.Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
      handsModule.setOptions({
        maxNumHands: 1, // Detect only one hand
      });
      handsModule.onResults((results) => {
        if (results.multiHandLandmarks) {
          const landmarks = results.multiHandLandmarks[0];
          // Process hand landmarks and detect alphabet
          // ...
        }
      });

      if (
        typeof window !== 'undefined' &&
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
      ) {
        videoRef.current.play();
        const videoElement = videoRef.current;
        const canvasElement = handDetectionRef.current;
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        handsModule.setInputVideo(videoElement);
        handsModule.setOutputCanvas(canvasElement);
        handsModule.initialize();
      }
    };

    runHandDetection();

    return () => {
      if (handDetectionRef.current) {
        handDetectionRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={handDetectionRef} />
    </div>
  );
};

export default HandDetection;
