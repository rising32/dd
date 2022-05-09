import React, { useState, useRef } from 'react';
import { Camera, CameraType } from 'react-camera-pro';
import { useParams } from 'react-router-dom';
import { CameraSvg } from '../../assets/svg';

function CameraView() {
  const params = useParams();

  const [clientID, setClientID] = useState(params.client_id);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const camera = useRef<CameraType>(null);

  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex flex-1'>
        {image ? (
          <div className='flex flex-col'>
            <img src={image} />
            <div>{clientID}</div>
          </div>
        ) : (
          <Camera
            ref={camera}
            aspectRatio={16 / 9}
            numberOfCamerasCallback={setNumberOfCameras}
            errorMessages={{
              noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
              permissionDenied: 'Permission denied. Please refresh and give camera permission.',
              switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
              canvas: 'Canvas is not supported.',
            }}
          />
        )}
      </div>
      <div className='flex justify-between my-6 px-4'>
        <button
          onClick={() => {
            if (image) {
              setImage(null);
            }
          }}
        >
          Cancel
        </button>
        <div
          onClick={() => {
            if (camera.current) {
              const photo = camera.current.takePhoto();
              setImage(photo);
            }
          }}
          className='w-8 h-8 rounded-full bg-white border-2 border-black outline outline-4 outline-white'
        />
        <button
          disabled={numberOfCameras <= 1}
          onClick={() => {
            if (camera.current) {
              const result = camera.current.switchCamera();
              console.log(result);
            }
          }}
        >
          <CameraSvg />
        </button>
      </div>
    </div>
  );
}

export default CameraView;
