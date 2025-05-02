# For ngnix server (optional if using vite on mac)
1. Copy nginx.conf to nginx server configuration folder. such as /usr/local/etc/nginx/nginx.conf
2. Copy all files in repository root to nginx www folder. Typically at /usr/local/var/www
3. Restart nginx server
4. Access web app at http://localhost:8080

# Install vite, npm on mac
1. Goto webapp's root folder
    npm install --save three
    npm install --save-dev vite
2. Run "npx vite --host" to start server on localhost:5173 on original code

# Make changes in repo
1. Make desired changes to code/files
2. Run "npx vite build" in root folder (Additionally add config to re-run on file changes if needed)
3. Add any new html files to vite.config.js for compiling
4. Goto dist folder and run "npx vite --host" to make webapp available at localhost:5173 on compiled code

# Debug with mac and Iphone/IPad
1. On mac enable Developer menu
2. On Iphone/Ipad ebnable Safari web inspector
3. Use a Lightning-to-USB cable to connect iPhone/IPad to mac
4. On mac, open localhost:5173 on Safari
5. In Safari Develop menu, select Iphone/IPad to open url (use ip address if needed using "ipconfig getifaddr en0")

# Commit code to repo
1. Commit all files and changes including dist folder
2. Run github pages on dist folder

# Repository info
All files are located in repository root for bitbucked to server web pages at url http://myearthgame.bitbucket.io


# Apple product screen widths for responsiveness css
Common Screen Widths (in pixels):
    375px: iPhone X, XS, 13 mini, 12 mini, SE (2nd & 3rd Gen)
    414px: iPhone 8 Plus, 7 Plus, 6S Plus, XR, 11, XS Max, 11 Pro Max, 12, 13, 14
    390px: iPhone 12, 13, 14, 12 Pro, 13 Pro, 14 Pro
    428px: iPhone 12 Pro Max, 13 Pro Max, 14 Plus, 15 Plus
    430px: iPhone 15 Pro Max, 15 Plus, 14 Pro Max, 16 Plus
    440px: iPhone 16 Pro Max
    402px: iPhone 16 Pro
    393px: iPhone 15, 14 Pro 