// 等待页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
  const uploadArea = document.getElementById('uploadArea');
  const imageInput = document.getElementById('imageInput');
  const startDiagnosis = document.getElementById('startDiagnosis');
  const resultSection = document.getElementById('resultSection');
  const previewImg = document.getElementById('previewImg');
  const resultContent = document.getElementById('resultContent');
  const aiConsultationButton = document.getElementById('aiConsultationButton');
  const aiChatContainer = document.getElementById('aiChatContainer');
  const closeChat = document.getElementById('closeChat');
  const chatInput = document.getElementById('chatInput');
  const sendButton = document.getElementById('sendButton');
  const chatMessages = document.getElementById('chatMessages');

  let uploadedFile = null;

  // AI问诊相关功能
  aiConsultationButton.addEventListener('click', () => {
    aiChatContainer.style.display = 'flex';
    // 添加欢迎消息
    addWelcomeMessage();
  });

  closeChat.addEventListener('click', () => {
    aiChatContainer.style.display = 'none';
    // 清空聊天记录
    chatMessages.innerHTML = '';
  });

  function addWelcomeMessage() {
    const welcomeMessage = "您好！我是您的AI牙科助手。我可以为您解答关于口腔健康的问题，提供专业的建议。请问有什么可以帮到您的吗？";
    addMessage(welcomeMessage, false);
  }

  function addMessage(content, sender, messageId = null) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) {
        console.error('Chat messages container not found');
        return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (messageId) {
        messageDiv.id = messageId;
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addStreamingMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    messageDiv.id = 'streamingMessage';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="fas fa-robot"></i>';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.id = 'streamingContent';
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageContent;
  }

  function updateStreamingMessage(content) {
    const streamingContent = document.getElementById('streamingContent');
    if (streamingContent) {
      streamingContent.textContent = content;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  // 添加等待消息
  function addLoadingMessage() {
    const messageId = 'loading-' + Date.now();
    const content = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    messageDiv.id = messageId;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageId;
  }

  // 移除等待消息
  function removeLoadingMessage(messageId) {
    const loadingMessage = document.getElementById(messageId);
    if (loadingMessage) {
        loadingMessage.remove();
    }
  }

  async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // 添加用户消息
    addMessage(message, 'user');
    input.value = '';
    
    // 添加等待消息
    const loadingId = addLoadingMessage();
    
    try {
        // const response = await fetch('/api/chat', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         message: message,
        //         model: 'deepseek-r1:1.5b'
        //     })
        // });
        const response = await fetch('/chat_ollama', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: message,
                model: 'deepseek-r1:1.5b'
            })
        });

        if (!response.ok) {
            throw new Error('网络请求失败');
        }
        
        // 移除等待消息
        removeLoadingMessage(loadingId);
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponse = '';
        
        // 添加AI回复消息
        const aiMessageId = 'ai-message-' + Date.now();
        addMessage('', 'ai', aiMessageId);
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            aiResponse += chunk;
            updateMessage(aiMessageId, aiResponse);
        }
        
    } catch (error) {
        console.error('Error:', error);
        // 移除等待消息
        removeLoadingMessage(loadingId);
        addMessage('抱歉，发生了错误。请稍后重试。', 'ai');
    }
  }

  sendButton.addEventListener('click', sendMessage);
  
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // 点击上传区域触发文件选择
  uploadArea.addEventListener('click', () => {
    imageInput.click();
  });

  // 拖拽悬停效果
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  // 拖拽释放上传
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImage(file);
    }
  });

  // 文件选择事件
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImage(file);
    }
  });

  // 处理图片上传与预览
  function handleImage(file) {
    uploadedFile = file;
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      document.getElementById('uploadPlaceholder').style.display = 'none';
      document.getElementById('imagePreview').style.display = 'flex';
      document.getElementById('previewActions').style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  // 点击开始诊断按钮
  startDiagnosis.addEventListener('click', () => {
    if (!uploadedFile) {
      showError('请先上传牙齿图像');
      return;
    }
    runPrediction(uploadedFile);
  });

  // 调用后端AI诊断接口
  function runPrediction(file) {
    const formData = new FormData();
    formData.append('file', file);

    showLoading();

    // fetch('http://localhost:5000/predict', {
    //   method: 'POST',
    //   body: formData
    // })
      fetch('/predict', {
          method: 'POST',
          body: formData
        })
      .then(res => res.json())
      .then(data => {
        hideLoading();
        if (data.error) {
          showError(data.error);
        } else {
          displayDiagnosis(data.result, data.confidence);
        }
      })
      .catch(err => {
        hideLoading();
        showError('诊断失败，请重试');
        console.error(err);
      });
  }

  // 显示诊断结果
  function displayDiagnosis(result, confidence) {
    const isHealthy = result === '健康牙齿';
    const color = isHealthy ? '#52c41a' : '#ff4d4f';
    const message = isHealthy ? '未发现明显问题，建议保持良好口腔卫生习惯。' : '检测到可能异常，建议尽快就诊。';

    resultContent.innerHTML = `
      <div style="border-left: 6px solid ${color}; padding-left: 12px;">
        <h3 style="color: ${color};">诊断结果：${result}</h3>
        <p style="color: ${color}; font-weight: bold;">置信度：${(confidence * 100).toFixed(2)}%</p>
        <p>${message}</p>
      </div>
    `;

    resultSection.style.display = 'block';
  }

  // 显示加载中
  function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loadingIndicator';
    loading.className = 'loading-indicator';
    loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在分析...';
    document.body.appendChild(loading);
  }

  // 隐藏加载中
  function hideLoading() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) loading.remove();
  }

  // 显示错误提示
  function showError(msg) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
    document.body.appendChild(error);
    setTimeout(() => error.remove(), 3000);
  }

  function updateMessage(messageId, content) {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
        const contentDiv = messageElement.querySelector('.message-content');
        if (contentDiv) {
            contentDiv.textContent = content;
            // 确保消息可见
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }
  }

  // 显示面板的函数
  window.showPanel = function(panelId, event) {
    if (event) {
        event.preventDefault();
    }
    // 隐藏所有面板
    document.querySelectorAll('.panel-container').forEach(panel => {
        panel.style.display = 'none';
    });
    
    // 显示选中的面板
    const selectedPanel = document.getElementById(panelId);
    if (selectedPanel) {
        selectedPanel.style.display = 'block';
        
        // 如果是AI问诊面板，添加欢迎消息
        if (panelId === 'aiChat') {
            const chatMessages = document.getElementById('chat-messages');
            // 清空现有消息
            if (chatMessages) {
                chatMessages.innerHTML = '';
                // 添加欢迎消息
                const welcomeMessages = [
                    '您好！我是您的AI眼科助手。',
                    '我可以帮您：',
                    '1. 解答眼部健康问题',
                    '2. 提供眼部保健建议',
                    '3. 分析眼部症状',
                    '4. 推荐就医建议',
                    '请问有什么可以帮您的吗？'
                ];
                
                // 逐条添加欢迎消息
                welcomeMessages.forEach((msg, index) => {
                    setTimeout(() => {
                        addMessage(msg, 'ai');
                    }, index * 500); // 每条消息间隔500毫秒
                });
            }
        }
    }
  }

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
      .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 4px 8px;
      }
      
      .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #4dd0e1;
          border-radius: 50%;
          animation: typing 1s infinite ease-in-out;
      }
      
      .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
      }
      
      .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
      }
      
      @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
      }
  `;
  document.head.appendChild(style);
});
