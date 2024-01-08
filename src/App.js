import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash'; 
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [imageURL, setImageURL] = useState('');
  const API_TOKEN = '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';

  // Debounce function to delay API calls
  const debouncedSearch = _.debounce((text) => {
    if (text) {
      axios
        .post(
          'https://api-inference.huggingface.co/models/prompthero/openjourney-v4',
          {
            inputs: text,
          },
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
            responseType: 'blob',
          }
        )
        .then((response) => {
          const imageUrl = URL.createObjectURL(response.data);
          setImageURL(imageUrl);
        })
        .catch((error) => {
          console.error('Error generating image:', error);
        });
    }
  }, 2000); // Adjust the debounce delay as needed (in milliseconds)

  useEffect(() => {
    debouncedSearch(inputText);
  }, [inputText, debouncedSearch]);

  return (
    <div className="parent">
      <div className="container">
        <h1 >Image Generation App</h1>
        <form>
          <input
            type="text"
            placeholder="Enter text..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="input"
          />
        </form>

        {imageURL && (
          <div className="image">
            <img src={imageURL} alt="Generated"  />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
