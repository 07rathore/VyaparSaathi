# Gemini API Troubleshooting

## Model Not Found Error

If you're getting "404 Not Found" errors for all models, try these steps:

### 1. Check Available Models

Visit this URL in your browser (replace YOUR_API_KEY):
```
https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY
```

This will show you all available models for your API key.

### 2. Test Models via API

Use the test endpoint:
```bash
# List available models
curl http://localhost:5000/api/test-models/list

# Test a specific model
curl -X POST http://localhost:5000/api/test-models/test \
  -H "Content-Type: application/json" \
  -d '{"modelName": "gemini-pro"}'
```

### 3. Common Model Names

Try these model names (one should work):
- `gemini-pro` (most common)
- `gemini-1.5-pro`
- `gemini-1.5-flash`
- `gemini-2.0-flash-exp`

### 4. Check API Key

- Make sure your API key is valid
- Check if billing is enabled (some models require it)
- Verify the API key has the right permissions

### 5. Regional Availability

Some models may not be available in all regions. Check Google's documentation for regional availability.

### 6. Update Model List

If you find a working model, you can update `backend/utils/gemini.js` and add it to the `MODEL_OPTIONS` array at the top of the list.







