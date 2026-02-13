# VisioNiX Frontend Developer Guide

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Architecture Overview

### State Management
- **AuthContext** - User authentication and session
- **ChatContext** - Chat history and current conversation
- **ExtractionContext** - Image analysis results

### Pages
1. **AuthPage** (`/`) - Login/Signup
2. **ChatPage** (`/chat`) - Main chatbot interface
3. **ExtractionPage** (`/extractions`) - Results viewer

### Components
- **Sidebar** - Chat navigation and history
- **ChatWindow** - Message display and input
- **ModelSelector** - AI model selection
- **Message** - Individual chat message
- **ExtractionCard** - Result card in list view
- **ExtractionDetails** - Full result details

---

## Development Tasks

### Adding Authentication API
1. Open `src/context/AuthContext.jsx`
2. Replace mock functions with actual API calls:
```javascript
const login = async (email, password) => {
  const response = await axios.post('/api/auth/login', { email, password });
  setUser(response.data.user);
  localStorage.setItem('token', response.data.token);
};
```

### Adding Chat Message API
1. Open `src/components/ChatWindow.jsx`
2. Replace simulated response (line 49-61) with API call:
```javascript
const response = await axios.post('/api/chat/message', {
  chatId: currentChatId,
  message: userMessage.content,
  model: selectedModel
});
```

### Adding Image Upload
1. Add file input to ChatWindow
2. Create FormData with image
3. POST to `/api/extractions/upload` endpoint

### Adding Extraction API
1. Open `src/context/ExtractionContext.jsx`
2. Replace mock data fetch with API call:
```javascript
const response = await axios.get('/api/extractions');
setExtractions(response.data);
```

---

## File Modifications Needed for Each Page

### Page 1 - Authentication (Complete)
- ✅ Login form
- ✅ Sign up form
- ✅ Form validation
- 🔄 API integration needed

### Page 2 - Chatbot (UI Complete)
- ✅ Message display
- ✅ Input area
- ✅ Sidebar with history
- ✅ Model selector
- 🔄 API integration needed
- 🔄 File upload needed

### Page 3 - Extraction Results (Complete)
- ✅ Results list
- ✅ Detail view
- ✅ JSON display
- ✅ Copy/Download functionality
- 🔄 API integration needed

---

## Component Props Reference

### Message
```javascript
<Message message={{
  id: '1',
  role: 'user|assistant',
  content: 'Message text'
}} />
```

### ExtractionCard
```javascript
<ExtractionCard
  extraction={extractionObject}
  isSelected={boolean}
  onSelect={() => {}}
  onDelete={() => {}}
/>
```

### ExtractionDetails
```javascript
<ExtractionDetails extraction={extractionObject} />
```

---

## Context Hooks Usage

### Use Auth
```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
}
```

### Use Chat
```javascript
import { useChat } from '../hooks/useChat';

function MyComponent() {
  const {
    chats,
    currentChatId,
    selectedModel,
    getCurrentChat,
    createNewChat,
    addMessage,
    updateChatTitle,
    deleteChat,
    setCurrentChatId,
    setSelectedModel
  } = useChat();
}
```

### Use Extraction
```javascript
import { useExtraction } from '../hooks/useExtraction';

function MyComponent() {
  const {
    extractions,
    selectedExtraction,
    getCurrentExtraction,
    addExtraction,
    deleteExtraction,
    setSelectedExtraction
  } = useExtraction();
}
```

---

## Styling Guide

### Tailwind Color Classes
- **Primary**: `bg-primary`, `text-primary`, `border-primary`
- **Secondary**: `bg-secondary`, `text-secondary`, `border-secondary`
- **Dark**: `bg-dark`, `text-dark`
- **Light**: `bg-light`, `text-light`
- **Errors**: `text-error`, `bg-error`

### Common Patterns
```jsx
// Button
<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors">
  Click me
</button>

// Card
<div className="bg-white p-4 rounded-lg border border-border shadow-sm">
  Card content
</div>

// Form Input
<input className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />

// Badge
<span className="px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm">Badge</span>
```

---

## Icon Reference

Icons from `lucide-react`:
- `Plus` - New item
- `Trash2` - Delete
- `History` - Chat history
- `LogOut` - Logout
- `Send` - Send message
- `User` - User avatar
- `Bot` - Bot/AI avatar
- `Loader` - Loading spinner
- `Zap` - Model selection
- `ArrowLeft` - Go back
- `Image` - View images/extractions
- `Copy` - Copy text
- `Download` - Download file
- `Eye` - View/selected indicator
- `Mail` - Email field
- `Lock` - Password field

---

## Common Issues & Solutions

### Issue: Context throws error about being outside Provider
**Solution**: Make sure the page is wrapped with the context provider in App.jsx

### Issue: Styling not applying
**Solution**: Check if Tailwind classes match the config. Run `npm run build` to rebuild.

### Issue: Images not loading
**Solution**: Add images to `public/` folder and reference as `/image-name.jpg`

### Issue: API errors
**Solution**: Check console logs, ensure backend endpoints match the paths used in fetch calls

---

## Performance Tips

1. **Use useCallback** for function props to prevent re-renders
2. **Memoize** expensive components with React.memo
3. **Lazy load** pages with React.lazy if needed
4. **Debounce** search/input fields for API calls
5. **Cache** API responses using Context state

---

## Testing Checklist

- [ ] Login/signup form validation
- [ ] Chat message sending and display
- [ ] Model selection updates responses
- [ ] Chat history navigation
- [ ] Extraction results display
- [ ] JSON copy/download functionality
- [ ] Responsive design on mobile
- [ ] Error messages display
- [ ] Loading states work
- [ ] Logout clears session

---

## Deployment Checklist

- [ ] Remove all console.log() debug statements
- [ ] Test all API endpoints
- [ ] Update backend URLs for production
- [ ] Test authentication flow
- [ ] Verify CORS settings
- [ ] Check environment variables
- [ ] Test on actual devices
- [ ] Verify build succeeds: `npm run build`
- [ ] Test production build locally: `npm run preview`

---

## Environment Variables

Create a `.env` file in frontend/ directory:
```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=VisioNiX
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run preview          # Preview production build locally

# Linting
npm run lint             # Check code style

# Cleaning
rm -rf node_modules     # Clean node_modules
npm install             # Reinstall dependencies
```

---

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Resources

- [React Documentation](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Axios Docs](https://axios-http.com)

---

Last Updated: 2024
VisioNiX Frontend
