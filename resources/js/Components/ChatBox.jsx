import React, { useEffect, useState, useRef } from "react";
import { useForm, usePage } from "@inertiajs/react";

export default function ChatBox({ initialMessages = [] }) {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState(initialMessages);
    const [typingUser, setTypingUser] = useState(null);
    
    // Refs for Enterprise timing & UI logic
    const scrollRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const remoteTypingTimeoutRef = useRef(null);
    const lastSentTimestamp = useRef(0);
    const fileInputRef = useRef(null);
    
    const [preview, setPreview] = useState(null);
    const { data, setData, post, processing, reset } = useForm({
        body: "",
        image: null,
    });

    // 1. Fluid Scroll & Read Receipt Trigger
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        
        // Mark the last message as read if it's from someone else
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.user_id !== auth.user.id && !lastMessage.is_read) {
            window.axios.post(route("messages.read", lastMessage.id));
        }
    }, [messages, typingUser]);

    // 2. WebSocket Listeners
    useEffect(() => {
        const channel = window.Echo.channel("chat");

        channel.listen("MessageSent", (e) => {
            setMessages((prev) => {
                if (prev.find((m) => m.id === e.message.id)) return prev;
                return [...prev, e.message];
            });
        });

        // Listener for Read Receipts
        channel.listen(".MessageRead", (e) => {
            setMessages((prev) => 
                prev.map(msg => msg.id === e.message_id ? { ...msg, is_read: true } : msg)
            );
        });

        channel.listen(".Typing", (e) => {
            if (e.typing && e.user_name !== auth.user.name) {
                setTypingUser(e.user_name);
                if (remoteTypingTimeoutRef.current) clearTimeout(remoteTypingTimeoutRef.current);
                remoteTypingTimeoutRef.current = setTimeout(() => setTypingUser(null), 4000);
            } else if (!e.typing) {
                setTypingUser(null);
            }
        });

        return () => window.Echo.leaveChannel("chat");
    }, [auth.user.name]);

    // 3. Heartbeat Typing Logic
    const handleInputChange = (e) => {
        setData("body", e.target.value);
        const now = Date.now();
        if (now - lastSentTimestamp.current > 1500) {
            lastSentTimestamp.current = now;
            window.axios.post(route("typing"), { typing: true });
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            window.axios.post(route("typing"), { typing: false });
            lastSentTimestamp.current = 0;
        }, 3000);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!data.body.trim() && !data.image) return;
        post(route("messages.store"), {
            onSuccess: () => {
                reset();
                setPreview(null);
                window.axios.post(route("typing"), { typing: false });
            },
        });
    };

    return (
        /* Container: Added dark:bg-slate-900 and dark:border-slate-700 */
        <div className="flex flex-col h-[100dvh] lg:h-[90vh] w-full max-w-[2000px] mx-auto bg-white dark:bg-slate-900 shadow-2xl lg:rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-300">
            
            {/* Header: Added dark:bg-slate-900/80 and dark:border-slate-800 */}
            <div className="px-4 py-3 lg:px-8 lg:py-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3 lg:gap-5">
                    <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-lg lg:text-2xl font-black shadow-lg">#</div>
                    <div>
                        <h3 className="text-sm lg:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Enterprise Messaging</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] lg:text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">System Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Body: Added dark:bg-slate-950/50 */}
            <div ref={scrollRef} className="flex-1 p-4 lg:p-10 overflow-y-auto space-y-6 bg-gray-50/30 dark:bg-slate-950/50 scroll-smooth">
                {messages.map((msg, i) => {
                    const isMe = msg.user?.id === auth.user.id;
                    return (
                        <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`flex max-w-[90%] lg:max-w-[75%] ${isMe ? "flex-row-reverse" : "flex-row"} gap-2 lg:gap-4`}>
                                {/* Avatar: Added dark:bg-slate-700 */}
                                <div className={`hidden sm:flex flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10 rounded-xl items-center justify-center text-[10px] lg:text-sm font-black border ${isMe ? "bg-gray-900 dark:bg-indigo-500 text-white border-transparent" : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700"}`}>
                                    {msg.user?.name?.charAt(0)}
                                </div>
                                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                    {/* Message Bubble: Added dark:bg-slate-800 and dark:text-white */}
                                    <div className={`px-4 py-2.5 lg:px-6 lg:py-4 shadow-sm text-sm lg:text-lg xl:text-xl ${isMe ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none" : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-slate-700 rounded-2xl rounded-tl-none"}`}>
                                        {msg.body}
                                        {msg.image && (
                                            <img src={msg.image.startsWith('http') ? msg.image : `/storage/${msg.image}`} className="mt-2 rounded-lg max-w-full lg:max-w-xl block shadow-sm border dark:border-slate-700" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] lg:text-[11px] font-bold text-gray-400 dark:text-gray-600 uppercase">
                                            {isMe ? "You" : msg.user?.name} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                        {isMe && (
                                            <div className="flex items-center">
                                                <svg className={`w-3 h-3 lg:w-4 lg:h-4 ${msg.is_read ? "text-indigo-500" : "text-gray-300 dark:text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                                </svg>
                                                <svg className={`w-3 h-3 lg:w-4 lg:h-4 -ml-2 ${msg.is_read ? "text-indigo-500" : "text-gray-300 dark:text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Typing Indicator: Adjusted for Dark Mode */}
                {typingUser && (
                    <div className="flex items-center gap-2 px-2 py-1">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        </div>
                        <span className="text-[10px] lg:text-sm font-bold text-indigo-500 dark:text-indigo-400 italic uppercase tracking-wider">{typingUser} is typing...</span>
                    </div>
                )}
            </div>

            {/* Form Footer: Added dark:bg-slate-900 and dark:border-slate-800 */}
            <div className="p-3 lg:p-8 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shrink-0">
                {preview && (
                    <div className="mb-3 relative inline-block">
                        <img src={preview} className="w-16 h-16 lg:w-32 lg:h-32 object-cover rounded-xl border dark:border-slate-700 shadow-md" />
                        <button onClick={() => setPreview(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full py-1 px-2 shadow-sm">✕</button>
                    </div>
                )}
                {/* Input Container: Added dark:bg-slate-800 */}
                <form onSubmit={submit} className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-2xl lg:rounded-3xl p-1 lg:p-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 lg:p-4 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </button>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => {
                        const file = e.target.files[0];
                        setData("image", file);
                        setPreview(URL.createObjectURL(file));
                    }} />
                    <input 
                        type="text" 
                        value={data.body} 
                        onChange={handleInputChange} 
                        className="flex-1 bg-transparent border-none py-3 lg:py-5 px-2 text-sm lg:text-xl focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-gray-600 dark:text-white" 
                        placeholder="Type a message..." 
                    />
                    <button type="submit" className="p-3 lg:p-5 rounded-xl lg:rounded-2xl bg-indigo-600 text-white font-bold text-sm lg:text-lg uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-colors">Send</button>
                </form>
            </div>
        </div>
    );
}