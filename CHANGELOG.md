#CHANGELOG
V1.2.0:
    Notes:
      - A bunch of boring small fixes.
      - Now with client side compression uploading images should be a lot faster, and objects will take less space on the server.
    Added:
      - Restructured repo and added install scripts
      - Added image blobs
      - Compressorjs to compress images before uploading to server
      - Prevented files other than images from being uploaded.
    Changed:
      - Changed ID chars to work with barcodes.
    Deprecated:
    Removed:
    Fixed:
      - Temporary files now get removed. Not sure why this wasn't working but it does know so...
      - Prevented duplicate id being added to database after updating objects.
      - Fixed file uploads from android.
    Security:
V1.1.0:
    Notes:
      - Improved a number of add form issues, and created a changelog system with popup
      - Also altered npm start to use forever.js
    Added:
      - added polling after pressing submit
      - added update popup and changelog
      - added a changelog
      - implemented changelog popup on login
    Changed:
      - npm start now uses forever.js
    Deprecated:
    Removed:
    Fixed:
      - fixed date entry on safari
      - fixed form clearing on "submit and add new"
    Security:
V1.0.0:
  Notes:
    - Inital Release
  Added:
  Changed:
  Deprecated:
  Removed:
  Fixed:
  Security:
