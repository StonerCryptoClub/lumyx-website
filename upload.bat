@echo off
echo FTP Upload Script for Lumyx Agency Website
echo ========================================

:: Replace these with your actual FTP credentials
set FTP_HOST=your-ftp-host
set FTP_USER=your-ftp-username
set FTP_PASS=your-ftp-password

:: Create a temporary FTP script
echo open %FTP_HOST%> ftp_script.txt
echo %FTP_USER%>> ftp_script.txt
echo %FTP_PASS%>> ftp_script.txt
echo cd public_html>> ftp_script.txt
echo mput *.*>> ftp_script.txt
echo mput *.html>> ftp_script.txt
echo mput *.css>> ftp_script.txt
echo mput *.js>> ftp_script.txt
echo mput *.jpg>> ftp_script.txt
echo mput *.png>> ftp_script.txt
echo mput *.gif>> ftp_script.txt
echo mput *.ico>> ftp_script.txt
echo mput *.svg>> ftp_script.txt
echo mput *.woff>> ftp_script.txt
echo mput *.woff2>> ftp_script.txt
echo mput *.ttf>> ftp_script.txt
echo mput *.eot>> ftp_script.txt
echo mput *.map>> ftp_script.txt
echo quit>> ftp_script.txt

:: Run the FTP script
ftp -s:ftp_script.txt

:: Clean up
del ftp_script.txt

echo Upload complete!
pause 