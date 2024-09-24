' Start the Node.js server
CreateObject("Wscript.Shell").Run "C:\Users\Juan\Documents\PRON-PPT-GFS\NodeJS-GFS\server.bat", 1, False

' Wait for a few seconds to ensure the server starts
WScript.Sleep 5000

' Open the URL in the default browser (e.g., Chrome)
CreateObject("Wscript.Shell").Run "http://localhost:3000"