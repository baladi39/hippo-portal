#!/bin/bash

# Script to find and optionally delete empty files and folders (excluding node_modules)
# Usage: ./find-empty-safe.sh [directory]

# Set the directory to search (default to current directory)
SEARCH_DIR="${1:-.}"

echo "Searching for empty files and folders in: $SEARCH_DIR (excluding node_modules)"
echo "================================================================================"

# Check if directory exists
if [ ! -d "$SEARCH_DIR" ]; then
    echo "Error: Directory '$SEARCH_DIR' does not exist."
    exit 1
fi

# Find empty files (excluding node_modules and hidden directories)
echo ""
echo "EMPTY FILES (excluding node_modules):"
echo "-------------------------------------"
empty_files=$(find "$SEARCH_DIR" -type f -empty -not -path "*/node_modules/*" -not -path "*/.*" 2>/dev/null)
if [ -z "$empty_files" ]; then
    echo "No empty files found."
else
    echo "$empty_files"
    echo ""
    echo "Total empty files: $(echo "$empty_files" | wc -l | tr -d ' ')"
fi

echo ""
echo "EMPTY DIRECTORIES (excluding node_modules):"
echo "--------------------------------------------"
# Find empty directories (excluding node_modules and hidden directories)
empty_dirs=$(find "$SEARCH_DIR" -type d -empty -not -path "*/node_modules/*" -not -path "*/.*" 2>/dev/null)
if [ -z "$empty_dirs" ]; then
    echo "No empty directories found."
else
    echo "$empty_dirs"
    echo ""
    echo "Total empty directories: $(echo "$empty_dirs" | wc -l | tr -d ' ')"
fi

echo ""
echo "SUMMARY:"
echo "--------"
total_empty_files=$(find "$SEARCH_DIR" -type f -empty -not -path "*/node_modules/*" -not -path "*/.*" 2>/dev/null | wc -l | tr -d ' ')
total_empty_dirs=$(find "$SEARCH_DIR" -type d -empty -not -path "*/node_modules/*" -not -path "*/.*" 2>/dev/null | wc -l | tr -d ' ')
echo "Empty files: $total_empty_files"
echo "Empty directories: $total_empty_dirs"
echo "Total empty items: $((total_empty_files + total_empty_dirs))"

# Ask user if they want to delete the empty files and folders
if [ $((total_empty_files + total_empty_dirs)) -gt 0 ]; then
    echo ""
    echo "WARNING: This will permanently delete all empty files and directories listed above!"
    echo "This script excludes node_modules and hidden directories for safety."
    echo "Make sure you have backups if needed."
    echo ""
    read -p "Do you want to delete all empty files and directories? (y/N): " confirm
    
    case $confirm in
        [yY]|[yY][eE][sS])
            echo ""
            echo "Deleting empty files and directories..."
            
            # Delete empty files first
            deleted_files=0
            if [ $total_empty_files -gt 0 ]; then
                echo "Deleting empty files..."
                while IFS= read -r file; do
                    if [ -f "$file" ]; then
                        rm "$file" && echo "Deleted file: $file" && ((deleted_files++))
                    fi
                done < <(find "$SEARCH_DIR" -type f -empty -not -path "*/node_modules/*" -not -path "*/.*" 2>/dev/null)
            fi
            
            # Delete empty directories (need to do this multiple times for nested empty dirs)
            deleted_dirs=0
            if [ $total_empty_dirs -gt 0 ]; then
                echo "Deleting empty directories..."
                # Run up to 5 times to handle nested empty directories
                for i in {1..5}; do
                    empty_dirs_found=false
                    while IFS= read -r dir; do
                        if [ -d "$dir" ] && [ "$(ls -A "$dir" 2>/dev/null)" = "" ]; then
                            rmdir "$dir" 2>/dev/null && echo "Deleted directory: $dir" && ((deleted_dirs++)) && empty_dirs_found=true
                        fi
                    done < <(find "$SEARCH_DIR" -type d -empty -not -path "*/node_modules/*" -not -path "*/.*" 2>/dev/null | sort -r)
                    
                    # If no empty directories were found in this iteration, break
                    if [ "$empty_dirs_found" = false ]; then
                        break
                    fi
                done
            fi
            
            echo ""
            echo "DELETION SUMMARY:"
            echo "-----------------"
            echo "Files deleted: $deleted_files"
            echo "Directories deleted: $deleted_dirs"
            echo "Total items deleted: $((deleted_files + deleted_dirs))"
            ;;
        *)
            echo ""
            echo "Operation cancelled. No files or directories were deleted."
            ;;
    esac
else
    echo ""
    echo "No empty files or directories found to delete."
fi
