# Setup Guide for macOS (Without Docker/Colima)

If Docker is giving you certificate issues, you can set up PostgreSQL and MongoDB locally using Homebrew.

## Option A: Local Services with Homebrew (Recommended for M-series Macs)

### 1. Install Services

```bash
# PostgreSQL
brew install postgresql@16
brew services start postgresql@16

# MongoDB
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Redis (optional)
brew install redis
brew services start redis
```

### 2. Verify Services

```bash
# Test PostgreSQL
psql postgres -c "SELECT version();"

# Test MongoDB
mongosh --eval "db.adminCommand('ping')"

# Test Redis
redis-cli ping
```

### 3. Create Database

```bash
# Create PostgreSQL database
createdb groceries

# MongoDB creates database automatically
```

### 4. Run Backend

```bash
cd backend
npm install
npm run seed  # Populate MongoDB
npm run start:dev
```

Backend runs on `http://localhost:3000/api`

### 5. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Option B: Use Pre-built Docker Images (Workaround)

If you want to use Docker but need to avoid cert issues:

```bash
# Try using a different registry mirror
export DOCKER_BUILDKIT=0

# Or, use Podman instead (better M-series Mac support)
brew install podman
podman machine init
podman machine start
cd /path/to/groceries-app
podman-compose up -d
```

---

## Option C: Keep Trying Docker with Network Fix

If you're behind a corporate proxy/firewall:

```bash
# Check your network
curl -v https://registry.docker.io/v2/ 2>&1 | head -20

# If that fails, your network is blocking Docker Hub
# Solution: Ask your network admin to unblock Docker registries
# Or use a VPN
```

---

## My Recommendation

**Use Option A (Homebrew)** - it's faster on M-series Macs and avoids Docker altogether.

Then just run:

```bash
# Terminal 1
cd backend && npm run start:dev

# Terminal 2
cd frontend && npm run dev
```

Visit `http://localhost:5173` ✨

---

## Reverting Back to Docker Later

When your network is fixed, switch back:

```bash
# Restart Colima with fresh config
colima stop && colima delete
colima start

# Try docker-compose again
docker-compose up -d
```
