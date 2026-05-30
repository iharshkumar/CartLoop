import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaPaperPlane, FaTimes, FaCommentDots } from 'react-icons/fa';
import './Chatbot.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = SpeechRecognition ? new SpeechRecognition() : null;

if (mic) {
    mic.continuous = false;
    mic.interimResults = true;
    mic.lang = 'en-IN'; // Works well for both English and Hindi
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I am your ClassyShop AI assistant. How can I help you today? (नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?)", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (!mic) return;
        
        mic.onstart = () => {
            setIsListening(true);
        };

        mic.onresult = event => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            setInputValue(transcript);
        };

        mic.onend = () => {
            setIsListening(false);
        };

        mic.onerror = event => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };
    }, []);

    const toggleMic = () => {
        if (!mic) {
            alert("Your browser does not support voice to text. Please try Chrome.");
            return;
        }
        if (isListening) {
            mic.stop();
        } else {
            mic.start();
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = inputValue;
        setMessages(prev => [...prev, { text: userMsg, sender: "user" }]);
        setInputValue('');
        setIsTyping(true);

        try {
            const VITE_API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
            const response = await fetch(`${VITE_API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await response.json();
            
            if (data.success) {
                setMessages(prev => [...prev, { text: data.message, sender: "bot" }]);
            } else {
                setMessages(prev => [...prev, { text: "Sorry, I am having trouble connecting to the store database.", sender: "bot" }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { text: "Oops, something went wrong. Please try again later.", sender: "bot" }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chatbot-container">
            {isOpen ? (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <span>ClassyShop AI</span>
                        <FaTimes className="chatbot-close" onClick={() => setIsOpen(false)} />
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && <div className="chatbot-typing">AI is typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chatbot-input-area">
                        <input 
                            type="text" 
                            className="chatbot-input" 
                            placeholder="Type or speak..." 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button 
                            className={`chatbot-btn ${isListening ? 'mic-active' : ''}`} 
                            onClick={toggleMic}
                            title="Voice Input"
                        >
                            <FaMicrophone />
                        </button>
                        <button className="chatbot-btn" onClick={handleSend} title="Send">
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="chatbot-bubble" onClick={() => setIsOpen(true)}>
                    <FaCommentDots />
                </div>
            )}
        </div>
    );
};

export default Chatbot;
