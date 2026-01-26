$filePath = "c:\Users\Sherryen\OneDrive\Documents\Work\ViCar\vicar-premium-mobility\src\pages\HomePage.jsx"
$content = Get-Content $filePath -Raw -Encoding UTF8

# Replace the hardcoded text with translation key
$oldText = "Tell us where you're headed — we'll curate the vehicle, chauffeur, and timing with quiet precision."
$newText = "{t('home.tellUsWhere')}"
$content = $content.Replace($oldText, $newText)

# Write back to file
Set-Content $filePath -Value $content -Encoding UTF8 -NoNewline

Write-Host "Translation fixed successfully!"
