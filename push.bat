@echo off
echo ==============================================
echo   Umate Express - Push Updates to GitHub
echo ==============================================
echo.
git add .
set /p commit_msg="Enter update message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update website and rates
git commit -m "%commit_msg%"
git push origin main
echo.
echo ==============================================
echo   Done! Your website is updated on GitHub.
echo ==============================================
pause
