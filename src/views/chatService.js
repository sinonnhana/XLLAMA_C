import { botConfig } from './botConfig.js';  
export class ChatService {
    constructor(botType) {
      this.config = botConfig[botType];
      if (!this.config) {
        throw new Error(`Bot type ${botType} not found in config`);
      }
    }
    async sendMessage(messages) {
        try {
          const response = await fetch(this.config.apiEndpoint, {
            method: 'POST',
            headers: this.config.headers,
            body: JSON.stringify(this.config.formatRequest(messages))
          });
          const data = await response.json();
          return data.choices[0].message.content;
        } catch (error) {
          console.error(`Error in ${this.config.name} API call:`, error);
          throw error;
        }
      }
    async *streamMessage(messages, onProgress) {
      try {
        if (this.config.type === 'image') {
          const prompt = typeof messages === 'string' 
            ? messages 
            : messages[messages.length - 1]?.content;

          if (!prompt) {
            throw new Error('No prompt provided for image generation');
          }

          const response = await this.handleImageGeneration(prompt);
          yield response;
          if (onProgress) onProgress(response);
          return;
        }

        const formattedMessages = messages.map(msg => {
          if (Array.isArray(msg.content)) {
            return {
              role: msg.role,
              content: msg.content.map(item => {
                if (item.type === 'image_url') {
                  return {
                    type: 'image_url',
                    image_url: {
                      url: item.image_url.url,
                      detail: item.image_url.detail || 'auto'
                    }
                  }
                }
                return item
              })
            }
          }
          return {
            role: msg.role,
            content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
          }
        })

        const systemMessage = formattedMessages[0]?.role === 'system' ? [] : [{
          role: 'system',
          content: this.settings?.systemMessage || 
                   this.config.systemMessages?.[formattedMessages.length > 1 ? 'multiTurn' : 'singleTurn'] || 
                   this.config.systemPrompt ||
                   "You are a helpful assistant."
        }]

        const fullMessages = [...systemMessage, ...formattedMessages]

        console.log('Sending messages to API:', JSON.stringify(fullMessages, null, 2))

        const requestBody = {
          model: this.config.model || 'gpt-3.5-turbo',
          messages: fullMessages,
          stream: true,
          temperature: parseFloat(this.settings?.temperature) || 0.7,
          max_tokens: parseInt(this.settings?.maxTokens) || 2000
        }

        const response = await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: {
            ...this.config.headers,
            'Accept': 'text/event-stream',
          },
          body: JSON.stringify(requestBody)
        });
       
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
  
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
  
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
  
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const json = JSON.parse(line.slice(6));
                let content = '';
                
                // Handle different bot response formats
                if (this.config.type === 'text') {
                  content = json.choices[0]?.delta?.content || '';
                }
                if (content) {
                  yield content;
                  if (onProgress) onProgress(content);
                }
              } catch (e) {
                console.error('Error parsing SSE message:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error in ${this.config.name} API call:`, error);
        throw error;
      }
    }
    async refinePrompt(userPrompt) {
      try {
        const messages = [{
          role: "system",
          content: "You are a helpful assistant that improves prompts. Provide 2-3 improved versions of the given prompt. Each suggestion should start with a dash (-) on a new line."
        }, {
          role: "user",
          content: `Original prompt: "${userPrompt}"\n\nPlease suggest 2-3 improved versions of this prompt.`
        }];
    
        const response = await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: {
            ...this.config.headers,
            'Accept': 'text/event-stream',
          },
          body: JSON.stringify({
            model: this.config.model || 'gpt-3.5-turbo',
            messages: messages,
            stream: true,
            temperature: 0.7,
            max_tokens: 150
          })
        });
    
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }
    
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';
    
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
    
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
    
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const content = line.slice(6);
              if (content === '[DONE]') continue;  // Skip [DONE] messages
              
              try {
                const json = JSON.parse(content);
                if (json.choices?.[0]?.delta?.content) {
                  fullContent += json.choices[0].delta.content;
                }
              } catch (e) {
                console.error('Error parsing SSE message:', e);
              }
            }
          }
        }
    
        // Process the complete content after stream ends
        const refinedPrompts = fullContent
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.substring(1).trim());
    
        return refinedPrompts;
    
      } catch (error) {
        console.error('Error refining prompt:', error);
        return [];
      }
    }
    // New method for handling image generation
    async handleImageGeneration(prompt) {
      try {
        console.log('Image generation request:', {
          endpoint: this.config.apiEndpoint,
          body: this.config.formatRequest(prompt)
        });

        const response = await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: this.config.headers,
          body: JSON.stringify(this.config.formatRequest(prompt))
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Image generation response:', data);

        if (!data.data || !data.data[0] || !data.data[0].url) {
          throw new Error('Invalid response format from image API');
        }

        return data.data[0].url;
      } catch (error) {
        console.error('Error generating image:', error);
        throw error;
      }
    }
    setSettings(settings) {
      this.settings = settings;
    }
  }