@echo off
set "output_file=FileList.txt"

:: Check if the output file already exists and delete it
if exist "%output_file%" del "%output_file%"

:: Title for the output file
echo Directory and File Listing (Generated on %date% at %time%) > "%output_file%"
echo ========================================================= >> "%output_file%"
echo. >> "%output_file%"

:: The core command:
:: /S - Includes subdirectories
:: /A - Includes files with all attributes (normal, hidden, system, etc.)
:: /B - Uses bare format (no heading information or summary)
:: /O:N - Sorts by Name (alphabetically)
:: The output of the 'dir' command is appended (>>) to the output file
dir /S /A /B /O:N >> "%output_file%"

echo.
echo Operation Complete!
echo All directories and files have been listed in: "%output_file%"
pause