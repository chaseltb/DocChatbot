# ---------- Backend ----------
    FROM python:3.11-slim AS backend

    WORKDIR /app/backend
    COPY backend ./backend
    COPY backend/requirements.txt ./requirements.txt
    RUN pip install --no-cache-dir -r requirements.txt
    
    # ---------- Frontend ----------
    FROM node:18-alpine AS frontend
    
    WORKDIR /app/frontend
    COPY frontend ./frontend
    RUN npm install && npm run build
    
    # ---------- Final image ----------
    FROM python:3.11-slim
    
    # Copy backend from build
    COPY --from=backend /app/backend /app/backend
    # Copy frontend dist
    COPY --from=frontend /app/frontend/dist /app/backend/static
    
    # Install backend dependencies again in final image
    WORKDIR /app/backend
    RUN pip install --no-cache-dir -r requirements.txt
    
    EXPOSE 8000
    
    CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
    