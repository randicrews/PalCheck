var up = document.getElementsByClassName("fa-caret-up");
var down = document.getElementsByClassName("fa-caret-down");

Array.from(up).forEach(function(element) {
      element.addEventListener('click', function(){
        const word = this.parentNode.parentNode.childNodes[3].innerText
        const votes = parseFloat(this.parentNode.parentNode.childNodes[4].innerText)
        fetch('vote/up/', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'word': word,
            'votes':votes
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(down).forEach(function(element) {
      element.addEventListener('click', function(){
        const word = this.parentNode.parentNode.childNodes[3].innerText
        const votes = parseFloat(this.parentNode.parentNode.childNodes[4].innerText)
        fetch('vote/down/', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'word': word,
            'votes':votes
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});