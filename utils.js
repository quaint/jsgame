var request = new XMLHttpRequest();
      request.open('GET', 'http://www.html5canvastutorials.com/demos/assets/dataURL.txt', true);
      request.onreadystatechange = function() {
        // Makes sure the document is ready to parse.
        if(request.readyState == 4) {
          // Makes sure it's found the file.
          if(request.status == 200) {
            loadCanvas(request.responseText);
          }
        }
      };
      request.send(null);