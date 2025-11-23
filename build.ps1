# HRMS Build and Deployment Script

Write-Host "🚀 HRMS - Build Script for Railway Deployment" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path ".\backend") -or -not (Test-Path ".\frontend")) {
    Write-Host "❌ Error: Please run this script from the HRMS root directory (C:\hrms)" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Step 1: Installing Backend Dependencies..." -ForegroundColor Yellow
Push-Location backend
if (Test-Path "node_modules") {
    Write-Host "   Backend dependencies already installed ✓" -ForegroundColor Green
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Backend installation failed" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Write-Host "   Backend dependencies installed ✓" -ForegroundColor Green
}
Pop-Location

Write-Host ""
Write-Host "📦 Step 2: Installing Frontend Dependencies..." -ForegroundColor Yellow
Push-Location frontend
if (Test-Path "node_modules") {
    Write-Host "   Frontend dependencies already installed ✓" -ForegroundColor Green
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Frontend installation failed" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Write-Host "   Frontend dependencies installed ✓" -ForegroundColor Green
}
Pop-Location

Write-Host ""
Write-Host "🏗️  Step 3: Building Frontend for Production..." -ForegroundColor Yellow
Push-Location frontend

# Remove old build if exists
if (Test-Path "build") {
    Remove-Item -Recurse -Force build
    Write-Host "   Removed old build directory" -ForegroundColor Gray
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "   Frontend build completed ✓" -ForegroundColor Green
Pop-Location

Write-Host ""
Write-Host "🗄️  Step 4: Initializing Database..." -ForegroundColor Yellow
Push-Location backend

# Remove old database
if (Test-Path "database.sqlite") {
    Remove-Item database.sqlite
    Write-Host "   Removed old database" -ForegroundColor Gray
}

node src/scripts/initDb.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Database initialization warning (may be okay)" -ForegroundColor Yellow
} else {
    Write-Host "   Database initialized with sample data ✓" -ForegroundColor Green
}
Pop-Location

Write-Host ""
Write-Host "✅ Build Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Test locally: npm start (in both backend and frontend)" -ForegroundColor White
Write-Host "   2. Initialize Git: git init" -ForegroundColor White
Write-Host "   3. Add files: git add ." -ForegroundColor White
Write-Host "   4. Commit: git commit -m 'Initial commit'" -ForegroundColor White
Write-Host "   5. Create GitHub repo and push code" -ForegroundColor White
Write-Host "   6. Deploy to Railway (see QUICK_DEPLOY.md)" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   • README.md - Full documentation" -ForegroundColor White
Write-Host "   • QUICK_DEPLOY.md - Fast deployment guide" -ForegroundColor White
Write-Host "   • DEPLOYMENT.md - Detailed deployment instructions" -ForegroundColor White
Write-Host ""
