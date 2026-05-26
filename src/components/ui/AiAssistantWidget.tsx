'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiAssistantWidgetProps {
  contextType: 'admin' | 'placement';
  extraContext?: string;
}

export function AiAssistantWidget({ contextType, extraContext }: AiAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I'm your SARVAM ${contextType === 'admin' ? 'Admin' : 'Career'} Assistant. How can I help you today?` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: inputValue.trim() }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          contextType,
          extraContext,
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.details ? `Error: ${data.details}` : 'Oops! Something went wrong on my end.' }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Failed to reach the server. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl border-accent-primary/30 bg-black/90 backdrop-blur-md">
          <CardHeader className="p-4 border-b border-white/10 flex flex-row items-center justify-between bg-accent-primary/10">
            <CardTitle className="text-sm flex items-center gap-2 text-accent-primary">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              {contextType === 'admin' ? 'Admin Assistant' : 'Career AI'}
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full hover:bg-white/10" onClick={() => setIsOpen(false)}>
              ✕
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-accent-primary text-white rounded-tr-none' : 'bg-white/10 text-slate-200 rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-white/10 text-slate-200 rounded-tl-none animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="p-3 border-t border-white/10">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex w-full gap-2">
              <Input
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-white/5 border-white/10 focus-visible:ring-accent-primary"
                disabled={isLoading}
              />
              <Button type="submit" size="sm" className="bg-accent-primary hover:bg-accent-primary/90" disabled={isLoading || !inputValue.trim()}>
                ➤
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-[0_0_20px_rgba(0,212,255,0.4)] bg-gradient-to-r from-accent-primary to-purple-600 hover:scale-110 transition-transform p-0 flex items-center justify-center border-2 border-white/10"
        >
          <span className="text-2xl">✨</span>
        </Button>
      )}
    </div>
  );
}
