import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import defaultimage from '../Assets/defaultimage.png';

export const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState('/');
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    const prompt = inputRef.current.value;
    if (!prompt) {
      alert("Please enter a prompt.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const blob = await response.blob();
      const imageObjectURL = URL.createObjectURL(blob);
      setImageUrl(imageObjectURL);

    } catch (error) {
      console.error('Image generation error:', error);
      alert("Error generating image. Please check the API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">AI Image <span>Generator</span></div>

      <div className="img-loading">
        <div className="image">
          <img src={imageUrl === '/' ? defaultimage : imageUrl} alt="Generated" />
        </div>
        <div className="loading">
          <div className={loading ? 'loading-bar-full' : 'loading-bar'}></div>
          <div className={loading ? 'loading-text' : 'display-none'}>
            Generating Image...
          </div>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe what you want to see"
        />
        <div className="generate-btn" onClick={generateImage}>
          Generate
        </div>
      </div>
    </div>
  );
};
