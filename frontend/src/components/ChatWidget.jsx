import { useState } from 'react';
import { MessageCircle, X, Send, Mic, Image as ImageIcon, Loader } from 'lucide-react';
import { chatWithBot } from '../services/api';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm Dr. AI. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await chatWithBot(input);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: response.response,
                sender: 'bot'
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting to the server.",
                sender: 'bot'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-primary hover:bg-dark'
                    }`}
            >
                {isOpen ? <X className="text-white" /> : <MessageCircle className="text-white" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col animate-slide-up" style={{ height: '500px' }}>
                    {/* Header */}
                    <div className="bg-primary p-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">AI</span>
                        </div>
                        <div>
                            <h3 className="text-white font-medium">DocTalk Assistant</h3>
                            <p className="text-green-100 text-xs">Always here to help</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 shadow-sm rounded-tl-none border border-gray-100'
                                    }`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                                    <Loader size={16} className="animate-spin text-primary" />
                                    <span className="text-xs text-gray-500">Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-200 focus-within:border-primary transition-colors">
                            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                <ImageIcon size={20} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                <Mic size={20} />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type or ask..."
                                className="flex-1 bg-transparent outline-none text-sm"
                            />
                            <button
                                onClick={handleSend}
                                className="p-2 bg-primary text-white rounded-full hover:bg-dark transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
